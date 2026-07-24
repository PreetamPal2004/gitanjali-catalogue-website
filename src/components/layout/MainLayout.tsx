import { Outlet } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import StickyMobileBar from './StickyMobileBar';
import FloatingWhatsApp from './FloatingWhatsApp';
import CompareModal from '../common/CompareModal';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Ambient background orbs */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <StickyMobileBar />
      <FloatingWhatsApp />
      <CompareModal />
    </div>
  );
}
