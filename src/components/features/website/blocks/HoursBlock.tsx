import React from 'react';
import type { HoursLocationBlockContent } from '../../../../types/website';
import { Clock, MapPin } from 'lucide-react';

interface HoursBlockProps {
    content: HoursLocationBlockContent;
}

export const HoursBlock: React.FC<HoursBlockProps> = ({ content }) => {
    return (
        <div className="py-24 bg-[#111] border-t border-[#222]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">

                {/* Location */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#D4AF37] mb-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm uppercase tracking-widest">Location</span>
                    </div>
                    <h3 className="font-display text-3xl text-[#EDEDED]">{content.address}</h3>
                    <div className="h-64 bg-[#222] rounded-lg flex items-center justify-center border border-[#333] text-[#666]">
                        {/* Map Embed Placeholder */}
                        Map Integration Protected by CSP
                    </div>
                </div>

                {/* Hours */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#D4AF37] mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm uppercase tracking-widest">Opening Hours</span>
                    </div>

                    <div className="space-y-4">
                        {content.schedule.map((slot, i) => (
                            <div key={i} className="flex justify-between text-[#EDEDED] border-b border-[#333] pb-2 last:border-0">
                                <span className="font-medium">{slot.day}</span>
                                <span className="text-[#888]">{slot.hours}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
