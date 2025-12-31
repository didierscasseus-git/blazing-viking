import { useState } from 'react';
import type { WebsitePage } from '../../../types/website';
import { HeroBlock } from './blocks/HeroBlock';
import { MenuPreviewBlock } from './blocks/MenuPreviewBlock';
import { HoursBlock } from './blocks/HoursBlock';
import { Monitor, Smartphone, Save } from 'lucide-react';
import { clsx } from 'clsx';

// Mock Data
const MOCK_HOME_PAGE: WebsitePage = {
    id: 'page_home',
    slug: 'home',
    title: 'Home Page',
    isPublished: true,
    blocks: [
        {
            id: 'block_1',
            type: 'USER_HERO',
            order: 0,
            content: {
                headline: 'Taste the Extraordinary',
                subheadline: 'A culinary journey through the heart of Quebec.',
                backgroundImageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop', // Placeholder Unsplash
                ctaText: 'Reserve Your Table'
            }
        },
        {
            id: 'block_2',
            type: 'USER_MENU_PREVIEW',
            order: 1,
            content: {
                title: 'Seasonal Classics',
                featuredCategoryIds: ['cat_1'],
                limit: 3
            }
        },
        {
            id: 'block_3',
            type: 'USER_HOURS_LOCATION',
            order: 2,
            content: {
                address: '1234 Rue Saint-Denis, Montréal, QC',
                schedule: [
                    { day: 'Mon-Wed', hours: '5pm - 10pm' },
                    { day: 'Thu-Sat', hours: '5pm - 11pm' },
                    { day: 'Sun', hours: 'Closed' }
                ]
            }
        }
    ]
};

const WebsiteEditor = () => {
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    return (
        <div className="h-full flex flex-col">
            {/* Editor Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-3xl text-[#EDEDED]">Restaurant Composer</h1>
                    <p className="text-[#888] text-sm">Editing <span className="text-[#D4AF37]">Home Page</span></p>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggles */}
                    <div className="bg-[#161616] border border-[#333] rounded-lg p-1 flex">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={clsx("p-2 rounded transition-all", viewMode === 'desktop' ? "bg-[#333] text-white" : "text-[#666]")}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={clsx("p-2 rounded transition-all", viewMode === 'mobile' ? "bg-[#333] text-white" : "text-[#666]")}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-white text-black font-medium rounded-lg transition-colors">
                        <Save className="w-4 h-4" />
                        <span>Publish Changes</span>
                    </button>
                </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 bg-[#111] border border-[#333] rounded-xl overflow-hidden relative flex justify-center py-12 overflow-y-auto">
                <div
                    className={clsx(
                        "bg-[#0A0A0A] shadow-2xl transition-all duration-300 origin-top overflow-hidden",
                        viewMode === 'mobile' ? "w-[375px] h-[812px] rounded-3xl border-[8px] border-[#222]" : "w-full h-fit min-h-full"
                    )}
                >
                    {/* Render Blocks */}
                    {MOCK_HOME_PAGE.blocks.map(block => {
                        switch (block.type) {
                            case 'USER_HERO':
                                return <HeroBlock key={block.id} content={block.content} />;
                            case 'USER_MENU_PREVIEW':
                                return <MenuPreviewBlock key={block.id} content={block.content} />;
                            case 'USER_HOURS_LOCATION':
                                return <HoursBlock key={block.id} content={block.content} />;
                            default:
                                return null;
                        }
                    })}

                    {/* Footer Placeholder for visual completeness */}
                    <div className="py-8 text-center border-t border-[#222]">
                        <p className="text-[#444] text-xs uppercase tracking-widest">© 2025 Restaurant Name</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteEditor;
