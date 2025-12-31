
import { motion } from 'framer-motion';

const DashboardHome = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <header>
                <h2 className="font-display text-4xl text-[#EDEDED] mb-2">Bon Service, Chef</h2>
                <p className="text-[#888]">Tuesday, December 30th</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Guests', value: '42', delta: '+12%' },
                    { label: 'Reservations', value: '18', delta: 'Upcoming' },
                    { label: 'Net Revenue', value: '$8,450', delta: '+5%' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-xl bg-[#161616] border border-[#333]"
                    >
                        <p className="text-[#888] text-sm uppercase tracking-wider mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <span className="font-display text-3xl text-[#EDEDED]">{stat.value}</span>
                            <span className="text-[#D4AF37] text-sm font-medium bg-[rgba(212,175,55,0.1)] px-2 py-1 rounded">
                                {stat.delta}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Placeholder Content Area */}
            <div className="h-96 rounded-xl border border-[#333] border-dashed flex items-center justify-center text-[#444]">
                Live Floor Plan View Component
            </div>
        </div>
    );
};

export default DashboardHome;
