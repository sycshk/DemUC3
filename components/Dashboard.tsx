import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts';
import { ArrowUpRight, CheckCircle, AlertCircle, PieChart, Download } from 'lucide-react';
import { DEPARTMENTS, WATERFALL_DATA, COLORS } from '../constants';

const KPICard = ({ title, value, sub, icon: Icon, alert }: { title: string, value: string, sub: string, icon: any, alert?: boolean }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
      <div className={`p-2 rounded-full ${alert ? 'bg-red-50 text-coke' : 'bg-blue-50 text-swire'}`}>
        <Icon size={18} />
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900 font-mono">{value}</div>
      <div className={`text-xs font-semibold mt-1 ${alert ? 'text-coke' : 'text-success'}`}>
        {sub}
      </div>
    </div>
  </div>
);

const WaterfallChart = () => {
  // Transformation for Recharts to simulate waterfall
  // We calculate float (transparent stack) and bar height dynamically
  let cumulative = 0;
  
  const data = WATERFALL_DATA.map(d => {
    const isDecrease = d.name === 'Savings'; // Identify subtractive items
    const isTotal = d.isTotal;
    
    let floatVal = 0;
    let barVal = 0;
    let displayVal = 0;

    if (isTotal) {
      cumulative = d.value;
      floatVal = 0;
      barVal = d.value;
      displayVal = d.value;
    } else if (isDecrease) {
      // For decreases: Bar sits on new total (cumulative - value) and goes up to old total
      floatVal = cumulative - d.value;
      barVal = d.value;
      displayVal = -d.value;
      cumulative -= d.value;
    } else {
      // For increases: Bar sits on old total and goes up to new total
      floatVal = cumulative;
      barVal = d.value;
      displayVal = d.value;
      cumulative += d.value;
    }

    return {
      name: d.name,
      float: floatVal,
      bar: barVal,
      displayVal: displayVal,
      fill: d.fill,
      isTotal: d.isTotal
    };
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col">
      <h3 className="text-lg font-bold text-swire mb-4">Budget Bridge (2024 Actuals vs 2025 Budget)</h3>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize: 12, fontFamily: 'monospace'}} unit="M" axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              formatter={(value: number, name: string, props: any) => {
                const { displayVal, isTotal } = props.payload;
                const prefix = displayVal > 0 && !isTotal ? '+' : '';
                return [`${prefix}$${Math.abs(displayVal).toFixed(2)}M`, 'Value'];
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="float" stackId="a" fill="transparent" />
            <Bar dataKey="bar" stackId="a" radius={[2, 2, 2, 2] as [number, number, number, number]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DepartmentTable = () => {
  const handleExportCSV = () => {
    const headers = ['Department', 'Head', 'Status', 'Total Budget', 'Last Year Actuals', 'YoY Change (%)'];
    const csvContent = [
      headers.join(','),
      ...DEPARTMENTS.map(dept => {
        const change = ((dept.totalBudget - dept.lastYearActuals) / dept.lastYearActuals) * 100;
        return [
          `"${dept.name}"`,
          `"${dept.head}"`,
          `"${dept.status}"`,
          dept.totalBudget,
          dept.lastYearActuals,
          change.toFixed(1)
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'department_budget_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-bold text-swire">Departmental Status</h3>
        <button className="text-sm text-swire font-medium hover:underline">View All</button>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-medium">
          <tr>
            <th className="px-6 py-3">Department</th>
            <th className="px-6 py-3">Head</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Total Budget</th>
            <th className="px-6 py-3 text-right">YoY Change (%)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {DEPARTMENTS.map((dept, index) => {
             const change = ((dept.totalBudget - dept.lastYearActuals) / dept.lastYearActuals) * 100;
             // Logic: Red for negative changes, Green for positive changes
             let textColor = 'text-gray-600';
             if (change > 0) textColor = 'text-success';
             if (change < 0) textColor = 'text-coke';

             let statusColor = 'bg-gray-100 text-gray-600';
             if (dept.status === 'Submitted') statusColor = 'bg-blue-100 text-blue-700';
             if (dept.status === 'Approved') statusColor = 'bg-green-100 text-green-700';
             if (dept.status === 'Review') statusColor = 'bg-amber-100 text-amber-700';

             return (
              <tr key={dept.id} className={`transition-colors hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <td className="px-6 py-4 font-medium text-slate-800">{dept.name}</td>
                <td className="px-6 py-4 text-gray-500">{dept.head}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>
                    {dept.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">
                  ${(dept.totalBudget / 1000000).toFixed(2)}M
                </td>
                <td className={`px-6 py-4 text-right font-mono font-medium ${textColor}`}>
                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm text-gray-700 font-medium hover:bg-gray-50 hover:text-swire transition-colors"
        >
          <Download size={16} />
          Export to CSV
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard 
          title="Total Budget 2025" 
          value="$12.5M" 
          sub="+5% vs Last Year" 
          icon={ArrowUpRight} 
          alert={true}
        />
         <KPICard 
          title="OpEx / CapEx Split" 
          value="85% / 15%" 
          sub="Healthy Ratio" 
          icon={PieChart} 
        />
        <KPICard 
          title="Completion" 
          value="4 / 12" 
          sub="Departments Submitted" 
          icon={CheckCircle} 
        />
        <KPICard 
          title="Pending Approval" 
          value="$1.8M" 
          sub="Requires Review" 
          icon={AlertCircle} 
          alert={false}
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <WaterfallChart />
        </div>
        <div className="lg:col-span-1">
           {/* Mini Summary or Action Items could go here. For now, reusing table or another card */}
           <div className="bg-swire text-white p-6 rounded-lg shadow-sm h-96 flex flex-col justify-center items-center text-center">
              <h3 className="text-xl font-bold mb-4">Approvals Due</h3>
              <div className="text-5xl font-mono font-bold mb-2">2</div>
              <p className="opacity-80 mb-8">Departments waiting for sign-off</p>
              <button className="bg-coke hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow-lg transition-colors">
                Go to Approvals
              </button>
           </div>
        </div>
      </div>

      {/* Data Table */}
      <DepartmentTable />
    </div>
  );
};

export default Dashboard;