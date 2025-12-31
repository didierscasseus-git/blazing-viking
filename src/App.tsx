
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import CheckoutPage from './pages/CheckoutPage';
import PrivacyPolicy from './components/features/legal/PrivacyPolicy';
import TermsOfService from './components/features/legal/TermsOfService';
import CookieConsent from './components/features/compliance/CookieConsent';
import WebsiteEditor from './components/features/website/WebsiteEditor';
import FloorPlanEditor from './components/features/operations/FloorPlanEditor';
import PosTerminal from './components/features/operations/PosTerminal';
import LandingPage from './components/marketing/LandingPage';

// Placeholder Pages for routing verification
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-12 border border-[#333] border-dashed rounded-xl h-96 flex items-center justify-center text-[#666]">
    <h1 className="font-display text-2xl">{title} Module Under Construction</h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public SaaS Landing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="checkout" element={<CheckoutPage />} />

          {/* Protected App Routes */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="reservations" element={<PlaceholderPage title="Reservations" />} />
            <Route path="floor-plan" element={<FloorPlanEditor />} />
            <Route path="pos" element={<PosTerminal />} />
            <Route path="kitchen" element={<PlaceholderPage title="Kitchen Display" />} />
            <Route path="customers" element={<PlaceholderPage title="CRM" />} />
            <Route path="website" element={<WebsiteEditor />} />
            <Route path="settings" element={<PlaceholderPage title="System Settings" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <CookieConsent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
