import React from 'react';
import type { MenuPreviewBlockContent } from '../../../../types/website';

interface MenuPreviewBlockProps {
    content: MenuPreviewBlockContent;
}

export const MenuPreviewBlock: React.FC<MenuPreviewBlockProps> = ({ content }) => {
    return (
        <div className="py-24 bg-[#0A0A0A] text-center">
            <h2 className="font-display text-4xl text-[#EDEDED] mb-12">{content.title}</h2>

            <div className="max-w-3xl mx-auto space-y-8 px-6">
                {/* Mock Items for Preview */}
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between items-baseline border-b border-[#333] pb-4 group cursor-default">
                        <div className="text-left">
                            <h3 className="text-xl text-[#EDEDED] font-display group-hover:text-[#D4AF37] transition-colors">Dish Name Example {item}</h3>
                            <p className="text-[#888] text-sm mt-1">Saffron, wild mushrooms, truffle oil, aged parmesan.</p>
                        </div>
                        <span className="text-[#D4AF37] font-medium ml-4">$34</span>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <button className="text-[#D4AF37] border-b border-[#D4AF37] pb-1 hover:text-white hover:border-white transition-all tracking-widest text-sm uppercase">
                    View Full Menu
                </button>
            </div>
        </div>
    );
};
