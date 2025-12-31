import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { clsx } from 'clsx';

interface ConsentState {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

const COOKIE_KEY = 'dining-os-consent-v1';

const CookieConsent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [preferences, setPreferences] = useState<ConsentState>({
        necessary: true, // Always true
        analytics: false, // Default off (Law 25)
        marketing: false, // Default off (Law 25)
    });

    useEffect(() => {
        const saved = localStorage.getItem(COOKIE_KEY);
        if (!saved) {
            // Small delay for animation
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        } else {
            setPreferences(JSON.parse(saved));
        }
    }, []);

    const savePreferences = (customState?: ConsentState) => {
        const finalState = customState || preferences;
        localStorage.setItem(COOKIE_KEY, JSON.stringify(finalState));
        setPreferences(finalState);
        setIsOpen(false);

        // Here we would trigger GTM or Pixel initialization based on flags
        if (finalState.analytics) console.log("Initializing Analytics...");
        if (finalState.marketing) console.log("Initializing Marketing...");
    };

    const handleAcceptAll = () => {
        savePreferences({ necessary: true, analytics: true, marketing: true });
    };

    const handleDeclineAll = () => {
        savePreferences({ necessary: true, analytics: false, marketing: false });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-[#161616] border border-[#333] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_20px_40px_rgba(0,0,0,0.6)]">

                        {/* Info Section */}
                        <div className="p-6 md:p-8 flex-1">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-[rgba(212,175,55,0.1)] rounded-lg text-[#D4AF37]">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-display text-xl text-[#EDEDED] mb-2">Your Privacy Choices</h3>
                                    <p className="font-interface text-[#888] text-sm leading-relaxed">
                                        Under <strong>Québec Law 25</strong>, you have the right to decide how your data is used.
                                        We assume "No" by default. We use cookies to enhance the dining experience and ensure security.
                                    </p>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-3 pl-16">
                                {/* Necessary */}
                                <div className="flex items-center justify-between group">
                                    <span className="text-[#EDEDED] text-sm font-medium">Strictly Necessary</span>
                                    <span className="text-[#666] text-xs uppercase tracking-wider">Required</span>
                                </div>

                                {/* Analytics */}
                                <div className="flex items-center justify-between">
                                    <label className="text-[#EDEDED] text-sm cursor-pointer flex-1">Analytics & Performance</label>
                                    <button
                                        onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                                        className={clsx(
                                            "w-10 h-6 rounded-full transition-colors relative",
                                            preferences.analytics ? "bg-[#D4AF37]" : "bg-[#333]"
                                        )}
                                    >
                                        <motion.div
                                            initial={false}
                                            animate={{ x: preferences.analytics ? 20 : 4 }}
                                            className="w-4 h-4 bg-white rounded-full absolute top-1 left-0"
                                        />
                                    </button>
                                </div>

                                {/* Marketing */}
                                <div className="flex items-center justify-between">
                                    <label className="text-[#EDEDED] text-sm cursor-pointer flex-1">Marketing & Loyalty</label>
                                    <button
                                        onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                                        className={clsx(
                                            "w-10 h-6 rounded-full transition-colors relative",
                                            preferences.marketing ? "bg-[#D4AF37]" : "bg-[#333]"
                                        )}
                                    >
                                        <motion.div
                                            initial={false}
                                            animate={{ x: preferences.marketing ? 20 : 4 }}
                                            className="w-4 h-4 bg-white rounded-full absolute top-1 left-0"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="bg-[#0A0A0A] p-6 md:w-72 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-[#333]">
                            <button
                                onClick={handleAcceptAll}
                                className="w-full py-3 bg-[#EDEDED] hover:bg-white text-black font-medium rounded-lg transition-colors"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={() => savePreferences()}
                                className="w-full py-3 bg-[#222] hover:bg-[#333] text-[#EDEDED] font-medium rounded-lg transition-colors"
                            >
                                Save Preferences
                            </button>
                            <button
                                onClick={handleDeclineAll}
                                className="w-full py-2 text-[#888] hover:text-[#B00020] text-sm transition-colors"
                            >
                                Decline Optional
                            </button>
                        </div>

                        {/* Close (Equivalent to Save Prefs mostly, or Decline? Usually Save) */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-[#444] hover:text-[#EDEDED]"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
