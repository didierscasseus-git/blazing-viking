import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Trash2 } from 'lucide-react';
import type { Table } from '../../../types/schema';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_TABLES: Table[] = [
    {
        id: 't1',
        floorPlanId: 'fp1',
        number: '101',
        capacity: 2,
        shape: 'round',
        coordinates: { x: 100, y: 100, rotation: 0 },
        status: 'available'
    },
    {
        id: 't2',
        floorPlanId: 'fp1',
        number: '102',
        capacity: 4,
        shape: 'rect',
        coordinates: { x: 300, y: 100, rotation: 0 },
        status: 'occupied'
    }
];

const FloorPlanEditor = () => {
    const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

    const addTable = (shape: 'round' | 'rect') => {
        const newTable: Table = {
            id: uuidv4(),
            floorPlanId: 'fp1',
            number: `${100 + tables.length + 1}`,
            capacity: shape === 'rect' ? 4 : 2,
            shape,
            coordinates: { x: 50, y: 50, rotation: 0 },
            status: 'available'
        };
        setTables([...tables, newTable]);
    };

    const deleteTable = (id: string) => {
        setTables(prev => prev.filter(t => t.id !== id));
        setSelectedTableId(null);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-3xl text-[#EDEDED]">Floor Plan Manager</h1>
                    <p className="text-[#888] text-sm">Design your dining room layout.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-[#161616] border border-[#333] rounded-lg p-1 flex">
                        <button
                            onClick={() => addTable('round')}
                            className="p-2 text-[#EDEDED] hover:bg-[#333] rounded transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                            <span>Add Round</span>
                        </button>
                        <button
                            onClick={() => addTable('rect')}
                            className="p-2 text-[#EDEDED] hover:bg-[#333] rounded transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <div className="w-4 h-4 border-2 border-current" />
                            <span>Add Rect</span>
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-white text-black font-medium rounded-lg transition-colors">
                        <Save className="w-4 h-4" />
                        <span>Save Layout</span>
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-[#111] border border-[#333] rounded-xl overflow-hidden relative">
                {/* Grid Background */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#888 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {tables.map(table => (
                    <motion.div
                        key={table.id}
                        drag
                        dragMomentum={false}
                        onDragEnd={() => {
                            // This is a naive implementation; in production we'd calculate relative to container
                            // For now we just rely on visual drag
                        }}
                        onClick={() => setSelectedTableId(table.id)}
                        initial={{ x: table.coordinates.x, y: table.coordinates.y, scale: 0 }}
                        animate={{ x: table.coordinates.x, y: table.coordinates.y, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
                        className={clsx(
                            "absolute cursor-grab flex items-center justify-center flex-col transition-colors",
                            table.shape === 'round' ? "rounded-full" : "rounded-lg",
                            selectedTableId === table.id
                                ? "border-2 border-[#D4AF37] z-40 bg-[#1A1A1A]"
                                : "border border-[#444] bg-[#161616] hover:border-[#666]"
                        )}
                        style={{
                            width: table.shape === 'round' ? 96 : 120,
                            height: 96,
                            left: 0,
                            top: 0
                        }}
                    >
                        <span className="font-display text-xl text-[#EDEDED]">{table.number}</span>
                        <div className="flex items-center gap-1 text-[#666] text-xs mt-1">
                            <UsersIcon count={table.capacity} />
                        </div>

                        {/* Quick Actions overlay on selection */}
                        {selectedTableId === table.id && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTable(table.id);
                                }}
                                className="absolute -top-10 right-0 p-2 bg-[#B00020] text-white rounded-full shadow-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const UsersIcon = ({ count }: { count: number }) => (
    <div className="flex -space-x-1">
        {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#666]" />
        ))}
        {count > 4 && <span>+</span>}
    </div>
);

export default FloorPlanEditor;
