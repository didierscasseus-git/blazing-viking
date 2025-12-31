import React from 'react';
import type { HeroBlockContent } from '../../../../types/website';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroBlockProps {
    content: HeroBlockContent;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ content }) => {
    return (
        <div className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Image / Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-60 transition-opacity duration-700 hover:opacity-50"
                style={{ backgroundImage: `url(${content.backgroundImageUrl})` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-4xl">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-display text-5xl md:text-7xl text-[#EDEDED] mb-6 leading-tight"
                >
                    {content.headline}
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-interface text-xl text-[#CDCDCD] mb-8 font-light tracking-wide"
                >
                    {content.subheadline}
                </motion.p>

                {content.ctaText && (
                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group px-8 py-4 bg-[#D4AF37] text-black font-medium tracking-widest text-sm uppercase hover:bg-white transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                        {content.ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                )}
            </div>
        </div>
    );
};
