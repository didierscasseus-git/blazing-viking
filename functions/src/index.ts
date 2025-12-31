import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();
const db = admin.firestore();

// Initialize Stripe with Secret Key (Env Var)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_PLACEHOLDER', {
    apiVersion: '2023-08-16',
});

// Quebec Tax Rates
const TAX_RATES = {
    TPS: 0.05,
    TVQ: 0.09975,
};

/**
 * Create Payment Intent (Callable)
 * Verifies Order total and creates Stripe Intent with Metadata
 */
export const createPaymentIntent = functions.https.onCall(async (data, context) => {
    // 1. Auth Check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { orderId, tipAmount = 0 } = data;

    if (!orderId) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing orderId.');
    }

    try {
        // 2. Fetch Order
        const orderRef = db.collection('orders').doc(orderId);
        const orderSnap = await orderRef.get();

        if (!orderSnap.exists) {
            throw new functions.https.HttpsError('not-found', 'Order not found.');
        }

        const orderData = orderSnap.data();
        const subtotal = orderData?.subtotal || 0; // In cents

        // 3. Calculate Taxes (Server Side)
        // Quebec rules: Tax is calculated on the subtotal
        const tpsAmount = Math.round(subtotal * TAX_RATES.TPS);
        const tvqAmount = Math.round(subtotal * TAX_RATES.TVQ);
        const taxTotal = tpsAmount + tvqAmount;

        // 4. Calculate Total
        const totalAmount = subtotal + taxTotal + tipAmount;

        // 5. Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'cad',
            metadata: {
                orderId: orderId,
                uid: context.auth.uid,
                tps: tpsAmount,
                tvq: tvqAmount,
                subtotal: subtotal,
                tip: tipAmount
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // 6. Log Audit Trail
        await db.collection('audit_logs').add({
            actorId: context.auth.uid,
            action: 'CREATE_PAYMENT_INTENT',
            targetResource: `orders/${orderId}`,
            metadata: {
                amount: totalAmount,
                intentId: paymentIntent.id
            },
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        return {
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id,
            amounts: {
                subtotal,
                tps: tpsAmount,
                tvq: tvqAmount,
                total: totalAmount
            }
        };

    } catch (error: any) {
        console.error("Payment Error", error);
        // Re-throw formatted error
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', error.message || 'Payment Service Failed');
    }
});

/**
 * Check Table Availability (Callable)
 * Checks if a specific table or any table of capacity N is free at a time slot.
 */
export const checkAvailability = functions.https.onCall(async (data, context) => {
    // Publicly accessible for website widget

    const { date, partySize, durationMinutes = 90 } = data; // ISO String date

    if (!date || !partySize) {
        throw new functions.https.HttpsError('invalid-argument', 'Date and Party Size required.');
    }

    const requestedStart = new Date(date);
    const requestedEnd = new Date(requestedStart.getTime() + durationMinutes * 60000);

    // 1. Get all tables that fit the party size
    const tablesRef = db.collection('tables');
    const eligibleTablesSnap = await tablesRef
        .where('capacity', '>=', partySize)
        .where('capacity', '<=', partySize + 2) // Optimization: Don't put 2 people on a 10-top
        .get();

    if (eligibleTablesSnap.empty) {
        return { available: false, message: "No tables match party size." };
    }

    const eligibleTableIds = eligibleTablesSnap.docs.map(doc => doc.id);

    // 2. Check for conflicts in Reservations collection
    // Query reservations that overlap with [start, end]
    // Overlap Logic: (ResStart < ReqEnd) AND (ResEnd > ReqStart)

    // Note: Firestore doesn't support complex range OR queries easily.
    // We fetch reservations for the day and filter in memory (efficient for <100 tables)

    const dayStart = new Date(requestedStart);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(requestedStart);
    dayEnd.setHours(23, 59, 59, 999);

    const conflictingResSnap = await db.collection('reservations')
        .where('startTime', '>=', dayStart)
        .where('startTime', '<=', dayEnd)
        .get();

    const busyTableIds = new Set();

    conflictingResSnap.forEach(doc => {
        const res = doc.data();
        const resStart = res.startTime.toDate();
        const resEnd = res.endTime.toDate();

        // Check Overlap
        if (resStart < requestedEnd && resEnd > requestedStart) {
            busyTableIds.add(res.tableId);
        }
    });

    // 3. Find Free Tables
    const freeTables = eligibleTableIds.filter(id => !busyTableIds.has(id));

    return {
        available: freeTables.length > 0,
        availableTableIds: freeTables,
        slot: { start: requestedStart, end: requestedEnd }
    };
});

/**
 * Create Reservation (Callable)
 * Transactionally books a table.
 */
export const createReservation = functions.https.onCall(async (data, context) => {
    const { contactName, contactEmail, contactPhone, date, partySize, notes, durationMinutes = 90 } = data;

    // validation
    if (!contactName || !contactPhone || !date || !partySize) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required details.');
    }

    const requestedStart = new Date(date);
    const requestedEnd = new Date(requestedStart.getTime() + durationMinutes * 60000); // 90 mins default

    return db.runTransaction(async (transaction) => {
        // 1. Re-run availability check inside transaction for safety
        // (Simplified for brevity: In prod, we'd lock the specific table)

        // Let's assume the client passes a preferredTableId or we pick one efficiently
        // For this demo, we'll pick the first available one logic again or trust the checkAvailability call 
        // BUT strict correctness requires re-querying inside transaction.

        // Strategy: We will just lock the first suitable table found.

        const tablesRef = db.collection('tables');
        const eligibleTablesQuery = tablesRef
            .where('capacity', '>=', partySize)
            .where('capacity', '<=', partySize + 2);

        const tablesSnap = await transaction.get(eligibleTablesQuery);
        const candidateTables = tablesSnap.docs.map(d => d.id);

        if (candidateTables.length === 0) {
            throw new functions.https.HttpsError('failed-precondition', 'No table capacity found.');
        }

        // Get reservations for today to check conflicts against candidates
        const dayStart = new Date(requestedStart); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(requestedStart); dayEnd.setHours(23, 59, 59, 999);

        const resRef = db.collection('reservations')
            .where('startTime', '>=', dayStart)
            .where('startTime', '<=', dayEnd);

        const resSnap = await transaction.get(resRef);

        const busyTables = new Set();
        resSnap.forEach(doc => {
            const r = doc.data();
            const rStart = r.startTime.toDate();
            const rEnd = r.endTime.toDate();
            if (rStart < requestedEnd && rEnd > requestedStart) {
                busyTables.add(r.tableId);
            }
        });

        const assignedTableId = candidateTables.find(t => !busyTables.has(t));

        if (!assignedTableId) {
            throw new functions.https.HttpsError('resource-exhausted', 'All tables booked for this slot.');
        }

        // 2. Create Reservation
        const newResRef = db.collection('reservations').doc();
        transaction.set(newResRef, {
            tableId: assignedTableId,
            contactName,
            contactEmail,
            contactPhone,
            partySize,
            notes: notes || '',
            startTime: requestedStart,
            endTime: requestedEnd,
            status: 'confirmed',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: context.auth ? context.auth.uid : 'guest_web'
        });

        return { success: true, reservationId: newResRef.id, tableId: assignedTableId };
    });
});

/**
 * Create Staff User (Callable)
 * Allows Admin to create a new user method.
 */
export const createStaffUser = functions.https.onCall(async (data, context) => {
    // 1. RBAC Check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');
    }

    // Verify requester is admin via their claim or Firestore profile
    // Note: Custom Claims is faster, but for now we query Firestore
    const requesterProfile = await db.collection('users').doc(context.auth.uid).get();
    const role = requesterProfile.data()?.role;

    if (role !== 'OWNER' && role !== 'MANAGER') {
        throw new functions.https.HttpsError('permission-denied', 'Only Admins can create staff.');
    }

    const { email, password, displayName, role: newRole } = data;

    if (!email || !password || !displayName || !newRole) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing fields.');
    }

    try {
        // 2. Create Auth User
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName,
        });

        // 3. Create Firestore Profile
        await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            displayName,
            role: newRole, // 'SERVER', 'HOST', 'KITCHEN'
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 4. Set Custom Claims (Optional but recommended for Rules)
        await admin.auth().setCustomUserClaims(userRecord.uid, { role: newRole });

        // 5. Audit Log
        await db.collection('audit_logs').add({
            actorId: context.auth.uid,
            action: 'CREATE_STAFF_USER',
            targetResource: `users/${userRecord.uid}`,
            metadata: { role: newRole },
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { uid: userRecord.uid, message: 'User created successfully.' };

    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});

/**
 * Trigger: On Reservation Created
 * Sends confirmation email (Mock).
 */
export const onReservationCreated = functions.firestore
    .document('reservations/{resId}')
    .onCreate(async (snap, context) => {
        const reservation = snap.data();
        const { contactEmail, contactName, date } = reservation;

        functions.logger.info(`[EMAIL DISPATCH] To: ${contactEmail}`, { structuredData: true, reservationId: context.params.resId });
        functions.logger.info(`[EMAIL BODY] Hi ${contactName}, your table for ${date} is confirmed.`);

        // Integration Point: await sendGrid.send({...})
        return null;
    });

/**
 * Trigger: On Order Status Change
 * Notifies Kitchen or Servers.
 */
export const onOrderUpdated = functions.firestore
    .document('orders/{orderId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();

        if (before.status !== after.status) {
            functions.logger.info(`[ORDER STATUS] Order ${context.params.orderId} changed from ${before.status} to ${after.status}`, { orderId: context.params.orderId, oldStatus: before.status, newStatus: after.status });

            // If status is 'ready', notify servers
            if (after.status === 'ready') {
                // Integration Point: Push Notification to iPad
                // await admin.messaging().sendToTopic('staff_devices', { ... })
            }
        }
        return null;
    });

/**
 * Schedule: Nightly Cleanup
 * Archives reservations older than 30 days.
 * Runs every day at 4 AM.
 */
export const nightlyCleanup = functions.pubsub.schedule('every day 04:00').onRun(async (context) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldResSnap = await db.collection('reservations')
        .where('startTime', '<', thirtyDaysAgo)
        .get();

    if (oldResSnap.empty) return null;

    const batch = db.batch();
    oldResSnap.forEach(doc => {
        // Move to archival collection
        const archiveRef = db.collection('archived_reservations').doc(doc.id);
        batch.set(archiveRef, doc.data());
        batch.delete(doc.ref);
    });

    await batch.commit();
    functions.logger.info(`[CLEANUP] Archived ${oldResSnap.size} reservations.`, { count: oldResSnap.size });
    return null;
});
