import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type AuditAction =
    | 'VIEW_CUSTOMER_PII'
    | 'EXPORT_DATA'
    | 'DELETE_DATA'
    | 'MODIFY_ORDER'
    | 'OVERRIDE_PRICE'
    | 'SYSTEM_SETTINGS_CHANGE';

interface AuditLogEntry {
    actorId: string;
    action: AuditAction;
    targetResource: string;
    metadata?: Record<string, any>;
    userAgent: string;
}

export const AuditService = {
    log: async (action: AuditAction, targetResource: string, metadata: Record<string, any> = {}) => {
        try {
            const user = auth.currentUser;
            if (!user) return; // Anonymous actions not logged or handled differently

            const entry: AuditLogEntry = {
                actorId: user.uid,
                action,
                targetResource,
                metadata,
                userAgent: navigator.userAgent
            };

            await addDoc(collection(db, 'audit_logs'), {
                ...entry,
                timestamp: serverTimestamp()
            });

        } catch (error) {
            // Fail silently in prod to not block user, but warn in dev
            console.warn('Audit Log Failed:', error);
        }
    }
};
