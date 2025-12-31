
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, UtensilsCrossed, Users, Settings, LogOut, ChefHat, Globe, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';


const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
        { icon: CalendarDays, label: 'Reservations', path: '/app/reservations' },
        { icon: UtensilsCrossed, label: 'Floor Plan', path: '/app/floor-plan' },
        { icon: CreditCard, label: 'POS Terminal', path: '/app/pos' },
        { icon: ChefHat, label: 'Kitchen', path: '/app/kitchen' },
        { icon: Users, label: 'Customers', path: '/app/customers' },
        { icon: Globe, label: 'Website', path: '/app/website' },
        { icon: Settings, label: 'Settings', path: '/app/settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0A0A0A] border-r border-[#333] flex flex-col z-50">
            {/* Brand Header */}
            <div className="p-8 pb-4">
                <h1 className="font-display text-2xl text-[#EDEDED] flex items-center gap-2">
                    <span className="text-[#D4AF37]">✦</span>
                    Restaurant OS
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                            isActive
                                ? "bg-[#161616] text-[#D4AF37]"
                                : "text-[#888] hover:bg-[#161616] hover:text-[#EDEDED]"
                        )}
                    >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-105" />
                        <span className="font-interface text-sm font-medium tracking-wide">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-[#333]">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3 w-full text-[#888] hover:text-[#B00020] transition-colors rounded-lg hover:bg-[#161616]"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-interface text-sm font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
