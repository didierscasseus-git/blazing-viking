
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-interface">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <div className="max-w-[1440px] mx-auto p-8 lg:p-12">
                    {/* Page Fade Transition wrapper could go here */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
