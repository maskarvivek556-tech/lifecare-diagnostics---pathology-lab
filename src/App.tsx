/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Keyboard } from 'lucide-react';
import { CommandPalette } from './components/CommandPalette';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ToastProvider } from './context/ToastContext';
import { AboutPage } from './pages/AboutPage';
import { BookTestPage } from './pages/BookTestPage';
import { ContactPage } from './pages/ContactPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { HealthPackagesPage } from './pages/HealthPackagesPage';
import { HomeCollectionPage } from './pages/HomeCollectionPage';
import { HomePage } from './pages/HomePage';
import { Lab3DPage } from './pages/Lab3DPage';
import { MedicalTestsPage } from './pages/MedicalTestsPage';
import { PatientReportsPage } from './pages/PatientReportsPage';
import { ReportGenerationPage } from './pages/ReportGenerationPage';
import { TestDetailPage } from './pages/TestDetailPage';

function AppShell() {
  const { path } = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const renderPage = () => {
    if (path === '/' || path === '') return <HomePage />;
    if (path === '/about') return <AboutPage />;
    if (path === '/tests') return <MedicalTestsPage />;
    if (path.startsWith('/tests/')) {
      const slug = path.replace('/tests/', '').split('/')[0];
      return <TestDetailPage slug={slug} />;
    }
    if (path === '/packages') return <HealthPackagesPage />;
    if (path === '/book') return <BookTestPage />;
    if (path === '/home-collection') return <HomeCollectionPage />;
    if (path === '/reports') return <PatientReportsPage />;
    if (path === '/report-generator') return <ReportGenerationPage />;
    if (path === '/lab-3d') return <Lab3DPage />;
    if (path === '/facilities') return <FacilitiesPage />;
    if (path === '/gallery') return <GalleryPage />;
    if (path === '/contact') return <ContactPage />;
    return <HomePage />;
  };

  const is3DPage = path === '/lab-3d';

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar onOpenCommandPalette={() => setPaletteOpen(true)} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />

      {/* Global Command Palette & Keyboard Shortcuts */}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />

      {/* Compact Desktop Floating Shortcuts Trigger (hidden on /lab-3d so 3D viewport stays 100% unobstructed) */}
      {!is3DPage && (
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open quick shortcuts and search (Ctrl+K)"
          className="no-print fixed bottom-5 left-5 z-30 hidden items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-lg transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:text-brand-navy sm:inline-flex"
        >
          <Keyboard className="h-3.5 w-3.5 text-teal-600" />
          <span>Shortcuts</span>
          <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
            Ctrl K
          </kbd>
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </RouterProvider>
  );
}
