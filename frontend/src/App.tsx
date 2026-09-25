import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/Dashboard';
import RegistroPage from './pages/Registro';
import MetasPage from './pages/Metas';

function App() {
  const [activeTab, setActiveTab] = useState<'registro' | 'dashboard' | 'metas'>('dashboard');

  return (
    <div className="app-container">
      {/* 1. Sidebar Left */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Wrapper Right */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header />

        {/* Dynamic Content Body based on selected tab */}
        <main className="content-body">
          {activeTab === 'dashboard' && <DashboardPage />}
          {activeTab === 'registro' && <RegistroPage />}
          {activeTab === 'metas' && <MetasPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
