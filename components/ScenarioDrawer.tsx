import React from 'react';
import { X, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { GlobalDrivers } from '../types';

interface ScenarioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drivers: GlobalDrivers;
  onUpdateDriver: (key: keyof GlobalDrivers, value: number) => void;
}

const ScenarioDrawer: React.FC<ScenarioDrawerProps> = ({ isOpen, onClose, drivers, onUpdateDriver }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer Panel */}
      <div className="relative w-96 bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="p-6 bg-swire text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Scenario Modeling</h2>
            <p className="text-sm opacity-80">Adjust global assumptions</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* GDP Growth */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-swire font-semibold">
              <TrendingUp size={18} />
              <label>GDP Growth Impact</label>
            </div>
            <div className="flex items-center gap-4">
               <input 
                  type="range" 
                  min="-2" 
                  max="8" 
                  step="0.5" 
                  value={drivers.gdpGrowth}
                  onChange={(e) => onUpdateDriver('gdpGrowth', parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-swire"
                />
                <span className="font-mono font-bold bg-slate-100 px-3 py-1 rounded min-w-[4rem] text-center">
                  {drivers.gdpGrowth}%
                </span>
            </div>
            <p className="text-xs text-gray-500">Affects projected revenue targets and variable OpEx limits.</p>
          </div>

          {/* Inflation Rate */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-swire font-semibold">
              <Percent size={18} />
              <label>Global Inflation Rate</label>
            </div>
             <div className="flex items-center gap-4">
               <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  step="0.1" 
                  value={drivers.inflationRate}
                  onChange={(e) => onUpdateDriver('inflationRate', parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-coke"
                />
                <span className="font-mono font-bold bg-slate-100 px-3 py-1 rounded min-w-[4rem] text-center">
                  {drivers.inflationRate}%
                </span>
            </div>
            <p className="text-xs text-gray-500">Automatically escalates all baseline OpEx entries unless locked.</p>
          </div>

          {/* FX Rate */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-swire font-semibold">
              <DollarSign size={18} />
              <label>USD to HKD Peg</label>
            </div>
            <div className="flex items-center gap-4">
                <input 
                  type="number"
                  step="0.01"
                  value={drivers.fxRate}
                  onChange={(e) => onUpdateDriver('fxRate', parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 font-mono focus:border-swire focus:ring-1 focus:ring-swire outline-none"
                />
            </div>
            <p className="text-xs text-gray-500">Central parity rate for consolidating regional budgets.</p>
          </div>

          <hr className="border-gray-200" />

          {/* Impact Preview */}
          <div className="bg-neutral-bg p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-2">Estimated Impact</h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Total Budget Variance</span>
              <span className={`font-mono font-bold ${drivers.inflationRate > 3 ? 'text-coke' : 'text-success'}`}>
                {drivers.inflationRate > 3 ? '+' : ''}{((drivers.inflationRate - 2.5) * 1.2).toFixed(2)}M
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className={`h-1.5 rounded-full ${drivers.inflationRate > 3 ? 'bg-coke' : 'bg-success'}`} 
                style={{ width: `${Math.min(Math.abs((drivers.inflationRate - 2.5) * 20), 100)}%` }}
              ></div>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button 
            onClick={onClose}
            className="w-full bg-swire text-white font-bold py-3 rounded hover:bg-swire-light transition-colors shadow-lg"
          >
            Apply Scenario
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDrawer;
