import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandMenu } from './components/common/CommandMenu';
import { AiCopilotModal } from './components/common/AiCopilotModal';

import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DemandForecastPage } from './pages/DemandForecastPage';
import { ProcurementRecommendationsPage } from './pages/ProcurementRecommendationsPage';
import { ProcurementOptimizerPage } from './pages/ProcurementOptimizerPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { AbcXyzPage } from './pages/AbcXyzPage';
import { StockoutRiskPage } from './pages/StockoutRiskPage';
import { OverstockPage } from './pages/OverstockPage';
import { WhatIfSimulatorPage } from './pages/WhatIfSimulatorPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f3f5f3] dark:bg-[#0b1210] text-slate-900 dark:text-slate-100">
      <Sidebar alertCount={8} onOpenCopilot={() => setIsCopilotOpen(true)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
          unreadAlertCount={8}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <CommandMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenCopilot={() => {
          setIsSearchOpen(false);
          setIsCopilotOpen(true);
        }}
      />

      <AiCopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<DashboardPage onOpenCopilot={() => {}} />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/inventory/product/:id" element={<ProductDetailPage />} />
              <Route path="/demand-intelligence/forecast" element={<DemandForecastPage />} />
              <Route path="/demand-intelligence/evaluation" element={<DemandForecastPage />} />
              <Route path="/procurement/recommendations" element={<ProcurementRecommendationsPage />} />
              <Route path="/procurement/optimizer" element={<ProcurementOptimizerPage />} />
              <Route path="/procurement/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/analytics/abc-xyz" element={<AbcXyzPage />} />
              <Route path="/analytics/stockout-risk" element={<StockoutRiskPage />} />
              <Route path="/analytics/overstock" element={<OverstockPage />} />
              <Route path="/analytics/simulation" element={<WhatIfSimulatorPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}
