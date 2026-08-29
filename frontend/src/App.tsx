import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/Dashboard';
import RegistroPage from './pages/Registro';

function App() {
  const [activeTab, setActiveTab] = useState<'registro' | 'dashboard'>('dashboard');

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
          {activeTab === 'dashboard' ? (
            <DashboardPage />
          ) : (
            <RegistroPage />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
