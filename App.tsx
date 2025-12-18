import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BudgetInput from './components/BudgetInput';
import ScenarioDrawer from './components/ScenarioDrawer';
import { GlobalDrivers, Scenario, Currency } from './types';
import { INITIAL_DRIVERS } from './constants';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Global App State
  const [scenarioDrawerOpen, setScenarioDrawerOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario>('Base');
  const [currency, setCurrency] = useState<Currency>('HKD');
  const [drivers, setDrivers] = useState<GlobalDrivers>(INITIAL_DRIVERS);

  const updateDriver = (key: keyof GlobalDrivers, value: number) => {
    setDrivers(prev => ({ ...prev, [key]: value }));
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'input':
        return <BudgetInput />;
      case 'approvals':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
             <div className="text-6xl mb-4">📝</div>
             <h2 className="text-2xl font-bold text-gray-600">Approval Workflow</h2>
             <p>Select a budget request to review line items and variances.</p>
          </div>
        );
      case 'reports':
        return (
           <div className="flex flex-col items-center justify-center h-full text-gray-400">
             <div className="text-6xl mb-4">📊</div>
             <h2 className="text-2xl font-bold text-gray-600">Reports Center</h2>
             <p>Generate PDF/Excel exports for Consolidation.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onNavigate={setActiveTab}
        onScenarioToggle={() => setScenarioDrawerOpen(true)}
        selectedScenario={selectedScenario}
        setScenario={setSelectedScenario}
        currency={currency}
        setCurrency={setCurrency}
      >
        {renderContent()}
      </Layout>

      <ScenarioDrawer 
        isOpen={scenarioDrawerOpen} 
        onClose={() => setScenarioDrawerOpen(false)}
        drivers={drivers}
        onUpdateDriver={updateDriver}
      />
    </>
  );
};

export default App;
