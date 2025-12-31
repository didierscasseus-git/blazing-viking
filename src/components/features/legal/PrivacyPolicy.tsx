import { useState } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    const [lang, setLang] = useState<'en' | 'fr'>('en');

    return (
        <div className="max-w-3xl mx-auto py-12 px-6">
            <header className="mb-12 flex items-center justify-between">
                <h1 className="font-display text-4xl text-[#EDEDED]">
                    {lang === 'en' ? 'Privacy Policy' : 'Politique de Confidentialité'}
                </h1>
                <div className="flex bg-[#161616] p-1 rounded-lg border border-[#333]">
                    <button
                        onClick={() => setLang('en')}
                        className={`px-3 py-1 text-sm rounded transition-all ${lang === 'en' ? 'bg-[#333] text-white' : 'text-[#888]'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLang('fr')}
                        className={`px-3 py-1 text-sm rounded transition-all ${lang === 'fr' ? 'bg-[#333] text-white' : 'text-[#888]'}`}
                    >
                        FR
                    </button>
                </div>
            </header>

            <motion.div
                key={lang}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 text-[#ABABAB] leading-relaxed font-interface"
            >
                {lang === 'en' ? (
                    <>
                        <section>
                            <h2 className="text-[#EDEDED] font-display text-xl mb-3">1. Law 25 Compliance</h2>
                            <p>
                                In accordance with <strong>Québec Law 25</strong>, we have designated a Data Protection Officer (DPO) and implemented strict governance policies. We only collect data that is strictly necessary for our operations (reservations, billing, and loyalty).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[#EDEDED] font-display text-xl mb-3">2. Data We Collect</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Identity Data (Name, email, phone number) for reservations.</li>
                                <li>Payment Data (Tokenized via Stripe). We do not store raw credit card numbers.</li>
                                <li>Dining Preferences (Allergies, seating preferences) to enhance service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[#EDEDED] font-display text-xl mb-3">3. Your Rights</h2>
                            <p>You have the right to request access to your data, request correction, or request full deletion (Right to be Forgotten). To exercise these rights, please contact our Data Protection Officer.</p>

                            <div className="mt-8 p-6 bg-[#1D1D1F] rounded-lg border border-[#333]">
                                <h3 className="text-sm uppercase tracking-wider text-[#888] mb-4">Contact Information / Data Protection Officer</h3>
                                <p className="text-white font-medium">Privacy Office</p>
                                <p>Email: <a href="mailto:privacy@privatediningos.com" className="text-white hover:underline">privacy@privatediningos.com</a></p>
                                <p>Address: 1234 Main St, Montreal, QC, H3Z 2Y7</p>
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        <section>
                            <h2 className="text-[#EDEDED] font-display text-xl mb-3">1. Conformité à la Loi 25</h2>
                            <p>
                                Conformément à la <strong>Loi 25 du Québec</strong>, nous avons désigné un Responsable de la protection des renseignements personnels (RPRP) et mis en place des politiques de gouvernance strictes. Nous ne collectons que les données strictement nécessaires à nos opérations.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-[#EDEDED] font-display text-xl mb-3">2. Données collectées</h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Données d'identité (Nom, courriel, téléphone) pour les réservations.</li>
                                <li>Données de paiement (Tokenisées via Stripe). Nous ne stockons pas les numéros de carte.</li>
                                <li>Préférences (Allergies, sièges) pour améliorer le service.</li>
                            </ul>
                        </section>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;
