import React, { useState } from 'react';
import { LayoutDashboard, FileSpreadsheet, CheckSquare, BarChart3, Settings, ChevronDown, Globe, Menu, X, Bell } from 'lucide-react';
import { Currency, Scenario } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onScenarioToggle: () => void;
  selectedScenario: Scenario;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  setScenario: (s: Scenario) => void;
}

const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-white/10 text-white font-semibold border-l-4 border-coke' 
        : 'text-gray-300 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, onNavigate, onScenarioToggle, selectedScenario, currency, setCurrency, setScenario 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-bg flex font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-swire transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-white/10 bg-slate-900">
             <div className="w-8 h-8 bg-coke rounded-sm flex items-center justify-center mr-3">
               <span className="text-white font-bold text-sm">SC</span>
             </div>
             <h1 className="text-white font-bold tracking-tight">SCC Budget <span className="text-gray-400 font-normal">v2.0</span></h1>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => onNavigate('dashboard')} />
            <NavItem icon={FileSpreadsheet} label="Budget Input" active={activeTab === 'input'} onClick={() => onNavigate('input')} />
            <NavItem icon={CheckSquare} label="Approvals" active={activeTab === 'approvals'} onClick={() => onNavigate('approvals')} />
            <NavItem icon={BarChart3} label="Reports" active={activeTab === 'reports'} onClick={() => onNavigate('reports')} />
          </nav>

          {/* Bottom Settings */}
          <div className="p-4 border-t border-white/10">
            <NavItem icon={Settings} label="Global Drivers" active={false} onClick={onScenarioToggle} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded">
               {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
             </button>
             <h2 className="text-xl font-bold text-slate-800 hidden md:block">
               {activeTab === 'dashboard' ? 'Executive Overview' : 'Financial Planning'}
             </h2>
          </div>

          {/* Global Controls */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Scenario Toggle */}
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              {(['Base', 'Best', 'Worst'] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                    selectedScenario === s 
                      ? 'bg-white text-swire shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Currency */}
            <div className="flex items-center gap-2 border-l pl-4 md:pl-6 border-gray-300">
               <Globe size={16} className="text-gray-400" />
               <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
               >
                 <option value="HKD">HKD ($)</option>
                 <option value="USD">USD ($)</option>
                 <option value="CNY">CNY (¥)</option>
               </select>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-swire transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coke rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-swire text-white flex items-center justify-center font-bold text-xs">
                JS
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
