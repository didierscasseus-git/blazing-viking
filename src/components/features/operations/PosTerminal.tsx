import { useState } from 'react';
import type { Order, OrderItem, MenuItem } from '../../../types/schema';
import { Minus, ChefHat, CreditCard } from 'lucide-react';

// Mock Menu Data
const MENU_CATEGORIES = [
    { id: 'cat_starters', name: 'Starters' },
    { id: 'cat_mains', name: 'Mains' },
    { id: 'cat_drinks', name: 'Drinks' }
];

const MENU_ITEMS: MenuItem[] = [
    {
        id: 'item_1',
        categoryId: 'cat_starters',
        name: { en: 'Truffle Arancini', fr: 'Arancini aux Truffes' },
        description: { en: 'Wild mushroom risotto balls.', fr: 'Boules de risotto.' },
        price: 1800,
        taxCategory: 'standard',
        isAvailable: true
    },
    {
        id: 'item_2',
        categoryId: 'cat_mains',
        name: { en: 'Duck Confit', fr: 'Confit de Canard' },
        description: { en: 'Slow cooked leg with potatoes.', fr: 'Cuisse cuite lentement.' },
        price: 3400,
        taxCategory: 'standard',
        isAvailable: true
    }
];

const PosTerminal = () => {
    const [currentOrder, setCurrentOrder] = useState<Partial<Order>>({
        items: [],
        subtotal: 0,
        taxTPS: 0,
        taxTVQ: 0,
        total: 0
    });

    const [selectedCategory, setSelectedCategory] = useState('cat_starters');

    const addToOrder = (item: MenuItem) => {
        const newItem: OrderItem = {
            itemId: item.id,
            name: item.name.en,
            price: item.price,
            quantity: 1,
            modifiers: []
        };

        setCurrentOrder(prev => {
            const items = [...(prev.items || []), newItem];
            const subtotal = items.reduce((sum, i) => sum + i.price, 0);
            return {
                ...prev,
                items,
                subtotal,
                total: subtotal * 1.14975 // Approx tax
            };
        });
    };

    return (
        <div className="h-full flex gap-6">
            {/* Menu Selection (Left) */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {MENU_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-4 rounded-xl font-medium text-lg whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-[#161616] text-[#888] hover:bg-[#222]'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                    {MENU_ITEMS.filter(i => i.categoryId === selectedCategory).map(item => (
                        <button
                            key={item.id}
                            onClick={() => addToOrder(item)}
                            className="p-6 bg-[#161616] border border-[#333] rounded-xl text-left hover:border-[#D4AF37] transition-colors group"
                        >
                            <h3 className="text-[#EDEDED] font-display text-xl group-hover:text-[#D4AF37]">{item.name.en}</h3>
                            <p className="text-[#666] text-sm mt-2 line-clamp-2">{item.description.en}</p>
                            <div className="mt-4 text-[#D4AF37] font-medium font-mono">${(item.price / 100).toFixed(2)}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Ticket (Right) */}
            <div className="w-96 bg-[#FAF9F6] text-[#111] rounded-xl flex flex-col shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <h2 className="font-display text-xl">Table 101</h2>
                    <p className="text-gray-500 text-sm">Server: Henry</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentOrder.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start">
                            <div>
                                <p className="font-medium font-interface">{item.name}</p>
                                <p className="text-xs text-gray-500">${(item.price / 100).toFixed(2)}</p>
                            </div>
                            <button className="text-red-500 hover:bg-red-50 p-1 rounded">
                                <Minus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-white border-t border-gray-200 space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${((currentOrder.subtotal || 0) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Tax (TPS/TVQ)</span>
                        <span>Calc at Checkout</span>
                    </div>
                </div>

                <div className="p-4 grid grid-cols-2 gap-2 bg-gray-50">
                    <button className="py-4 bg-[#111] text-white rounded-lg font-medium flex flex-col items-center justify-center gap-1 hover:bg-black">
                        <ChefHat className="w-5 h-5" />
                        <span className="text-xs">Kitchen</span>
                    </button>
                    <button className="py-4 bg-[#D4AF37] text-black rounded-lg font-medium flex flex-col items-center justify-center gap-1 hover:bg-[#c4a030]">
                        <CreditCard className="w-5 h-5" />
                        <span className="text-xs">Pay</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PosTerminal;
