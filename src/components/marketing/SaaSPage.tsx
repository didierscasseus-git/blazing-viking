import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, Quote, ShieldCheck, Zap, Globe, Layers } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const FadeIn = ({ children, delay = 0, y = 20 }: { children: React.ReactNode, delay?: number, y?: number }) => (
    <motion.div
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} // "Apple" ease
    >
        {children}
    </motion.div>
);

const StaggerContainer = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: delay }
            }
        }}
    >
        {children}
    </motion.div>
);

const StaggerItem = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
        }}
    >
        {children}
    </motion.div>
);

const SaaSPage = () => {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="bg-[#0A0A0A] min-h-screen font-sans selection:bg-[#FFE600] selection:text-black overflow-hidden relative">

            {/* Ambient Background Noise/Grain (Simulated via CSS) */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Gradient Orb */}
            <div className="fixed top-[-20%] left-[20%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none z-0" />

            {/* 0. Navigation */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/5 h-20 flex items-center justify-between px-6 md:px-12 transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full" />
                    </div>
                    <span className="font-hero font-bold text-lg tracking-tight text-white">Private Dining OS</span>
                </div>

                <div className="hidden md:flex items-center gap-10 text-sm font-medium text-[#888]">
                    <a href="#philosophy" className="hover:text-white transition-colors duration-200">Philosophy</a>
                    <a href="#features" className="hover:text-white transition-colors duration-200">Ecosystem</a>
                    <a href="#pricing" className="hover:text-white transition-colors duration-200">Membership</a>
                    <NavLink to="/" className="hover:text-white transition-colors duration-200">Login</NavLink>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium text-white hover:text-gray-300 transition-colors">Sign In</button>
                    <button className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-bold hover:bg-gray-200 active:scale-95 transition-all">
                        Get Started
                    </button>
                </div>
            </nav>

            {/* 1. Hero Section */}
            <section className="relative pt-48 pb-32 px-6 flex flex-col items-center text-center max-w-[1400px] mx-auto z-10">
                <motion.div style={{ y: heroY, opacity }} className="relative z-10">
                    <FadeIn y={40}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[#CCC] mb-8 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span>v1.0 Now Available in Quebec</span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1} y={60}>
                        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-white leading-[0.9] tracking-tighter mb-10">
                            The operating system <br /> <span className="text-[#444]">for high culture.</span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.2} y={40}>
                        <p className="font-body text-xl md:text-2xl text-[#888] max-w-2xl mx-auto leading-relaxed mb-12 font-light">
                            Unify your reservations, payments, and guest intelligence into one uncompromising interface.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <button className="group bg-white text-black rounded-full px-10 py-5 text-lg font-bold hover:bg-[#EEE] transition-all flex items-center gap-3">
                                Start Commissioning
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="group px-10 py-5 text-lg font-medium text-white border border-white/10 rounded-full hover:bg-white/5 transition-all flex items-center gap-3">
                                <Play className="w-5 h-5 fill-current opacity-60" />
                                Watch the Film
                            </button>
                        </div>
                    </FadeIn>
                </motion.div>

                {/* Hero Visual - "Square Style" Floating Mockup */}
                <FadeIn delay={0.5} y={100}>
                    <div className="mt-32 relative mx-auto w-full max-w-[1100px] perspective-[2000px] group">
                        {/* Glow behind */}
                        <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />

                        <motion.div
                            whileHover={{ rotateX: 2, scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="relative rounded-xl overflow-hidden shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)] border border-white/10 bg-[#111]"
                        >
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                            <img src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070&auto=format&fit=crop" alt="Dashboard Interface" className="w-full h-auto opacity-90 saturate-[0.8] contrast-[1.1]" />

                            {/* Overlay UI Elements for depth */}
                            <div className="absolute top-12 left-12 bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="text-xs text-[#666] uppercase tracking-widest mb-2">Live Revenue</div>
                                <div className="text-3xl font-display text-white tracking-tight">$4,289.00</div>
                            </div>
                        </motion.div>
                    </div>
                </FadeIn>
            </section>

            {/* 2. Divider Statement */}
            <section className="py-40 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <FadeIn>
                        <Quote className="w-12 h-12 text-[#333] mx-auto mb-12" />
                        <h2 className="font-display text-4xl md:text-6xl text-white leading-[1.1] tracking-tight">
                            "Most restaurant software is built for volume. We built ours for <span className="italic text-[#666] font-serif">value</span>."
                        </h2>
                    </FadeIn>
                </div>
            </section>

            {/* 3. Feature Grid - "Uber Style" bento */}
            <section id="features" className="py-32 px-6 bg-[#0E0E0E]">
                <div className="max-w-7xl mx-auto">
                    <FadeIn>
                        <div className="mb-24 flex items-end justify-between">
                            <h2 className="font-display text-5xl text-white tracking-tight">The Ecosystem</h2>
                            <p className="text-[#666] max-w-xs text-right hidden md:block">Engineered to replace 4+ disconnected tools.</p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">

                        {/* Card 1: Reservations (Tall) */}
                        <motion.div
                            className="col-span-1 md:col-span-1 bg-[#161616] rounded-3xl p-8 border border-white/5 flex flex-col justify-between group overflow-hidden relative"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl text-white font-bold mb-2">Zero-Fee Reservations</h3>
                                <p className="text-[#888] leading-relaxed">Own your guest data. No cover fees, no marketplace competition. Just pure hospitality.</p>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 to-transparent z-0" />
                            {/* Abstract Graphic */}
                            <div className="absolute bottom-[-20px] right-[-20px] w-64 h-64 bg-[#222] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                        </motion.div>

                        {/* Card 2: POS (Wide) */}
                        <motion.div
                            className="col-span-1 md:col-span-2 bg-[#161616] rounded-3xl p-8 border border-white/5 relative overflow-hidden group"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1A1A1A] to-transparent pointer-events-none" />
                            <div className="relative z-10 max-w-md">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <h3 className="text-3xl text-white font-bold mb-4">iPad POS Reimagined</h3>
                                <p className="text-[#888] text-lg leading-relaxed mb-8">
                                    Built for speed. 120ms interaction times. Fully integrated payments that respect Quebec TPS/TVQ laws automatically.
                                </p>
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 bg-white/5 rounded-lg text-sm text-[#CCC] border border-white/5">Split Bill Logic</div>
                                    <div className="px-4 py-2 bg-white/5 rounded-lg text-sm text-[#CCC] border border-white/5">Offline Mode</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3: Web (Standard) */}
                        <motion.div
                            className="col-span-1 md:col-span-2 bg-[#161616] rounded-3xl p-8 border border-white/5 flex items-center gap-12 group overflow-hidden"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="flex-1 z-10">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-colors">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl text-white font-bold mb-2">The Restaurant Composer</h3>
                                <p className="text-[#888] leading-relaxed">
                                    Build a stunning, SEO-optimized website in minutes. Blocks designed for culinary storytelling, not generic marketing.
                                </p>
                            </div>
                            <div className="flex-1 hidden md:block relative h-full">
                                {/* Abstract UI preview */}
                                <div className="absolute top-10 w-full h-full bg-[#111] border border-white/10 rounded-tl-2xl shadow-2xl p-4">
                                    <div className="w-full h-4 bg-white/10 rounded mb-4" />
                                    <div className="w-2/3 h-4 bg-white/5 rounded" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 4: Stats (Tall) */}
                        <motion.div
                            className="col-span-1 md:col-span-1 bg-[#EDEDED] rounded-3xl p-8 flex flex-col justify-center text-black group"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h3 className="text-6xl font-display font-bold mb-2 tracking-tighter">$2.4k</h3>
                            <p className="font-medium opacity-60 mb-8">Average annual savings per location vs competition.</p>
                            <div className="w-full h-1 bg-black/10 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-black rounded-full" />
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* 6. Pricing (SaaS) */}
            <section id="pricing" className="py-40 px-6 bg-[#0A0A0A]">
                <div className="max-w-5xl mx-auto">
                    <FadeIn>
                        <h2 className="font-display text-4xl md:text-5xl text-white mb-20 text-center tracking-tight">Membership</h2>
                    </FadeIn>

                    <StaggerContainer>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Tier 1 */}
                            <StaggerItem>
                                <div className="bg-[#111] p-10 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors h-full flex flex-col">
                                    <div className="text-[#888] font-bold tracking-widest text-xs uppercase mb-6">Discovery</div>
                                    <div className="text-5xl font-display text-white mb-2">$199</div>
                                    <div className="text-[#666] text-sm mb-10">/location /month</div>

                                    <ul className="space-y-4 mb-12 flex-1">
                                        {["Reservations", "POS Lite", "Basic CRM"].map(item => (
                                            <li key={item} className="flex items-center gap-3 text-[#CCC] text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-[#444]" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black transition-all">
                                        Start Trial
                                    </button>
                                </div>
                            </StaggerItem>

                            {/* Tier 2 - Hero */}
                            <StaggerItem>
                                <div className="bg-white p-10 rounded-[2rem] h-full flex flex-col transform md:scale-105 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] relative">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl">
                                        Standard
                                    </div>
                                    <div className="text-black/60 font-bold tracking-widest text-xs uppercase mb-6">Concierge</div>
                                    <div className="text-5xl font-display text-black mb-2">$399</div>
                                    <div className="text-black/40 text-sm mb-10">/location /month</div>

                                    <ul className="space-y-4 mb-12 flex-1">
                                        {[
                                            "All Discovery Features",
                                            "Website Composer",
                                            "Law 25 Compliance Suite",
                                            "Priority Support 24/7"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-3 text-black text-sm font-medium">
                                                <CheckCircle2 className="w-4 h-4 text-black" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm hover:bg-black/80 transition-all shadow-lg hover:shadow-xl">
                                        Join Now
                                    </button>
                                </div>
                            </StaggerItem>

                            {/* Tier 3 */}
                            <StaggerItem>
                                <div className="bg-[#111] p-10 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors h-full flex flex-col">
                                    <div className="text-[#888] font-bold tracking-widest text-xs uppercase mb-6">Portfolio</div>
                                    <div className="text-5xl font-display text-white mb-2">Custom</div>
                                    <div className="text-[#666] text-sm mb-10">/enterprise</div>

                                    <ul className="space-y-4 mb-12 flex-1">
                                        {["Multi-venue Management", "API Access", "Dedicated Success Mgr"].map(item => (
                                            <li key={item} className="flex items-center gap-3 text-[#CCC] text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-[#444]" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="w-full py-4 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black transition-all">
                                        Contact Sales
                                    </button>
                                </div>
                            </StaggerItem>
                        </div>
                    </StaggerContainer>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 px-6 border-t border-white/5 text-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div>
                        <span className="font-hero font-bold text-xl tracking-tight text-white block mb-6">Private Dining OS</span>
                        <p className="text-[#666] max-w-xs">
                            Crafted in Montreal for the world's finest tables. <br />
                            © 2025 Kaza Labs Inc.
                        </p>
                    </div>

                    <div className="flex gap-20">
                        <div>
                            <h4 className="text-white font-medium mb-6">Platform</h4>
                            <ul className="space-y-4 text-[#888]">
                                <li className="hover:text-white cursor-pointer transition-colors">Manifesto</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Roadmap</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Pricing</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-6">Legal</h4>
                            <ul className="space-y-4 text-[#888]">
                                <li><NavLink to="/privacy" className="hover:text-white transition-colors">Privacy (Law 25)</NavLink></li>
                                <li><NavLink to="/terms" className="hover:text-white transition-colors">Terms</NavLink></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default SaaSPage;
