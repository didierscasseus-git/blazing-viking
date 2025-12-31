import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '../types/schema';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    logout: async () => { },
    isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch User Profile from Firestore
                try {
                    // For dev/demo purposes, if profile doesn't exist we might want to return a dummy connection
                    // In production, this would fail if profile doesn't exist
                    const docRef = doc(db, 'users', firebaseUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setProfile(docSnap.data() as UserProfile);
                    } else {
                        console.warn("No user profile found for", firebaseUser.uid);
                        setProfile(null);
                    }
                } catch (err) {
                    console.error("Error fetching profile", err);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = () => signOut(auth);

    const isAdmin = profile?.role === 'OWNER' || profile?.role === 'MANAGER';

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
