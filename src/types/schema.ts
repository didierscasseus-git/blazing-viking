import { Timestamp } from 'firebase/firestore';

// --- Core Entities ---

export interface Restaurant {
    id: string;
    name: string;
    settings: {
        taxRates: {
            tps: number; // 0.05
            tvq: number; // 0.09975
        };
        timezone: string;
        currency: string;
    };
    branding: {
        logoUrl?: string;
        primaryColor?: string;
    };
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type UserRole = 'OWNER' | 'MANAGER' | 'SERVER' | 'HOST' | 'KITCHEN';

export interface UserProfile {
    uid: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    pinCode?: string; // Hashed
    isActive: boolean;
    deletedAt: Timestamp | null;
}

// --- Privacy & Compliance ---

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dietaryRestrictions: string[];
    notes?: string;
    marketingConsent: boolean; // Law 25
    consentDate: Timestamp;
    ltv: number;
    visitCount: number;
    isAnonymized: boolean;
}

// --- Operations ---

export interface FloorPlan {
    id: string;
    name: string;
    isActive: boolean;
}

export type TableShape = 'round' | 'rect';

export interface Table {
    id: string;
    floorPlanId: string;
    number: string;
    capacity: number;
    shape: TableShape;
    coordinates: {
        x: number;
        y: number;
        rotation: number;
    };
    status: 'available' | 'occupied' | 'dirty' | 'reserved';
}

export interface MenuItem {
    id: string;
    categoryId: string;
    name: { en: string; fr: string };
    description: { en: string; fr: string };
    price: number; // In cents
    taxCategory: 'standard' | 'alcohol' | 'zero-rated';
    isAvailable: boolean;
    modifiers?: ModifierGroup[];
}

export interface ModifierGroup {
    id: string;
    name: string;
    minSelection: number;
    maxSelection: number;
    options: ModifierOption[];
}

export interface ModifierOption {
    id: string;
    name: string;
    priceDelta: number;
}

// --- Reservations ---

export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';

export interface Reservation {
    id: string;
    customerId: string;
    tableId: string | null;
    partySize: number;
    dateTime: Timestamp;
    status: ReservationStatus;
    depositAmount: number;
    source: 'web' | 'phone' | 'walk-in';
    notes?: string;
}

// --- Commerce ---

export type OrderStatus = 'open' | 'sent_to_kitchen' | 'served' | 'paid';

export interface Order {
    id: string;
    tableId: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    taxTPS: number;
    taxTVQ: number;
    total: number;
    openedAt: Timestamp;
    closedAt?: Timestamp;
}

export interface OrderItem {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    modifiers: string[]; // List of ModifierOption names or IDs
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: 'card' | 'cash' | 'gift_card';
    provider: 'stripe' | 'manual';
    stripePaymentIntentId?: string;
    transactionStatus: 'success' | 'failed' | 'refunded';
    createdAt: Timestamp;
}
