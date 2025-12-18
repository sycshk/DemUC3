import React, { useState, useEffect } from 'react';
import { Save, Send, RotateCcw, Users, TrendingUp, Plane } from 'lucide-react';
import { INITIAL_COST_ITEMS, MONTHS } from '../constants';
import { CostItem } from '../types';

interface BudgetInputProps {
  // Props can include user role, department ID etc.
}

const BudgetInput: React.FC<BudgetInputProps> = () => {
  // Local State for Drivers
  const [headcount, setHeadcount] = useState(12);
  const [salaryIncrease, setSalaryIncrease] = useState(3.0);
  const [travelLevel, setTravelLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  
  // State for Grid Data
  const [items, setItems] = useState<CostItem[]>(INITIAL_COST_ITEMS);

  // Reactive Logic: When drivers change, update specific rows
  useEffect(() => {
    setItems(prevItems => prevItems.map(item => {
      // Logic: Update Base Salary row based on Headcount and Increase
      if (item.category === 'Staff' && item.description === 'Base Salaries') {
        const basePerHead = 12500; // Mock base
        const inflatedBase = basePerHead * (1 + salaryIncrease / 100);
        const totalMonthly = Math.round(inflatedBase * headcount);
        return { ...item, monthlyValues: Array(12).fill(totalMonthly) };
      }
      
      // Logic: Update Travel based on level
      if (item.category === 'Travel') {
        let baseTravel = 2000;
        if (travelLevel === 'Medium') baseTravel = 5000;
        if (travelLevel === 'High') baseTravel = 12000;
        return { ...item, monthlyValues: Array(12).fill(baseTravel) };
      }
      
      return item;
    }));
  }, [headcount, salaryIncrease, travelLevel]);

  // Handler for cell edits
  const handleCellChange = (itemId: string, monthIndex: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setItems(prev => prev.map(item => {
      if (item.id === itemId && !item.isLocked) {
        const newValues = [...item.monthlyValues];
        newValues[monthIndex] = numValue;
        return { ...item, monthlyValues: newValues };
      }
      return item;
    }));
  };

  const calculateTotal = (values: number[]) => values.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Drivers Panel */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Headcount Driver */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-swire uppercase tracking-wider flex items-center gap-2">
            <Users size={16} /> Headcount (FTE)
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="1" max="50" value={headcount} 
              onChange={(e) => setHeadcount(parseInt(e.target.value))}
              className="flex-1 accent-swire"
            />
            <span className="font-mono bg-white border px-3 py-1 rounded shadow-sm w-16 text-center">{headcount}</span>
          </div>
          <p className="text-xs text-gray-500">Drives 'Staff Costs' rows automatically.</p>
        </div>

        {/* Salary Driver */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-swire uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={16} /> Avg Salary Inc %
          </label>
           <div className="flex items-center gap-4">
            <input 
              type="range" min="0" max="10" step="0.5" value={salaryIncrease} 
              onChange={(e) => setSalaryIncrease(parseFloat(e.target.value))}
              className="flex-1 accent-swire"
            />
            <span className="font-mono bg-white border px-3 py-1 rounded shadow-sm w-16 text-center">{salaryIncrease}%</span>
          </div>
          <p className="text-xs text-gray-500">Applies inflation to base salary lines.</p>
        </div>

        {/* Travel Driver */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold text-swire uppercase tracking-wider flex items-center gap-2">
            <Plane size={16} /> Travel Frequency
          </label>
          <div className="flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            {(['Low', 'Medium', 'High'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setTravelLevel(level)}
                className={`flex-1 py-1.5 text-sm font-medium transition-colors ${
                  travelLevel === level ? 'bg-swire text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">Sets baseline regional travel budget.</p>
        </div>
      </div>

      {/* 2. The Input Grid */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[600px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-slate-800">Budget Input: Human Resources (HK)</h2>
          <div className="text-sm text-gray-500">
            Total Variance: <span className="text-coke font-mono font-bold">-$125,400</span> (Over Budget)
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-600 font-bold sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-3 text-left border-r border-gray-200 min-w-[200px] sticky left-0 bg-gray-100 z-20">Cost Item</th>
                <th className="p-3 text-left border-r border-gray-200 w-24">GL Code</th>
                <th className="p-3 text-left border-r border-gray-200 w-24">Type</th>
                {MONTHS.map(m => (
                  <th key={m} className="p-3 text-right border-r border-gray-200 min-w-[100px]">{m}</th>
                ))}
                <th className="p-3 text-right min-w-[120px] bg-gray-200 sticky right-0 z-20">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors group">
                  {/* Fixed Columns */}
                  <td className="p-3 border-r border-gray-200 sticky left-0 bg-white group-hover:bg-blue-50/50 font-medium text-slate-700 z-10">
                    {item.description}
                  </td>
                  <td className="p-3 border-r border-gray-200 font-mono text-xs text-gray-500">{item.glCode}</td>
                  <td className="p-3 border-r border-gray-200">
                    <span className={`px-2 py-0.5 text-xs rounded border ${
                      item.type === 'CapEx' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                      {item.type}
                    </span>
                  </td>

                  {/* Monthly Inputs */}
                  {item.monthlyValues.map((val, idx) => (
                    <td key={idx} className={`p-0 border-r border-gray-200 ${item.isLocked ? 'bg-gray-50' : ''}`}>
                      <input
                        type="text"
                        disabled={item.isLocked}
                        value={val === 0 ? '' : val.toLocaleString()}
                        onChange={(e) => handleCellChange(item.id, idx, e.target.value.replace(/,/g, ''))}
                        className={`w-full h-full p-3 text-right outline-none font-mono bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-swire ${item.isLocked ? 'cursor-not-allowed text-gray-400' : 'text-slate-800'}`}
                        placeholder="-"
                      />
                    </td>
                  ))}

                  {/* Total Column */}
                  <td className="p-3 text-right font-mono font-bold bg-gray-50 sticky right-0 z-10 border-l border-gray-200">
                    {calculateTotal(item.monthlyValues).toLocaleString()}
                  </td>
                </tr>
              ))}
              
              {/* Totals Row */}
              <tr className="bg-slate-800 text-white font-bold sticky bottom-0 z-20">
                <td className="p-3 sticky left-0 bg-slate-800 z-30">Grand Total</td>
                <td colSpan={2} className="p-3 bg-slate-800"></td>
                {MONTHS.map((m, idx) => {
                  const colTotal = items.reduce((sum, item) => sum + item.monthlyValues[idx], 0);
                  return (
                    <td key={idx} className="p-3 text-right font-mono border-r border-slate-700">
                      {colTotal > 0 ? (colTotal / 1000).toFixed(1) + 'k' : '-'}
                    </td>
                  );
                })}
                <td className="p-3 text-right font-mono bg-slate-900 sticky right-0 z-30">
                   {(items.reduce((sum, item) => sum + calculateTotal(item.monthlyValues), 0)).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-end items-center gap-4 rounded-b-lg">
          <button className="flex items-center gap-2 px-4 py-2 text-coke font-medium hover:bg-red-50 rounded transition-colors">
            <RotateCcw size={18} /> Reset to Actuals
          </button>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors">
            <Save size={18} /> Save Draft
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-swire text-white font-bold rounded shadow-md hover:bg-swire-light transition-colors">
            <Send size={18} /> Submit Budget
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetInput;
