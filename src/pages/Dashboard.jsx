import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
    FileText, 
    PlusCircle, 
    ArrowRight, 
    Clock, 
    CheckCircle, 
    ArrowUpRight,
    Users,
    Zap,
    DollarSign,
    Target
} from 'lucide-react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ 
        count: 0, 
        paid: 0, 
        unpaid: 0, 
        pending: 0, 
        revenue: 0, 
        tax: 0, 
        gstCount: 0, 
        nonGstCount: 0,
        totalCustomers: 0,
        todaySales: 0
    });
    const [recentBills, setRecentBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, billsRes] = await Promise.all([
                    api.get('/bills/stats'),
                    api.get('/bills?limit=5')
                ]);
                setStats(statsRes.data);
                setRecentBills(Array.isArray(billsRes.data) ? billsRes.data.slice(0, 5) : []);
            } catch (err) {
                toast.error('Error fetching dashboard stats');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const COLORS = ['#2d5a27', '#8b0000', '#b45309']; // Success, Danger, Warning
    const barData = [
        { name: 'Paid', value: stats.paid || 0 },
        { name: 'Unpaid', value: stats.unpaid || 0 },
        { name: 'Pending', value: stats.pending || 0 }
    ];

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-100">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#581c44] border-t-2 border-[#e5dbcd]"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Prasthan Data...</p>
            </div>
        </div>
    );

    return (
        <Layout>
            {/* Header Content */}
            <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between items-start gap-4">
                <div>
                     <div className="flex items-center gap-3 mb-2">
                        <img src="/assets/logo.png" alt="Logo" className="h-10 w-auto object-contain lg:hidden" />
                        <h1 className="text-2xl md:text-4xl font-extrabold text-[#581c44] tracking-tight leading-none italic">Welcome Back, Admin</h1>
                     </div>
                    <p className="text-slate-500 font-bold flex items-center gap-2 uppercase text-[10px] md:text-xs tracking-widest">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        Prasthan Travels System is live
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Link to="/add-gst-bill" className="flex-1 md:flex-none btn bg-[#581c44] text-white shadow-xl shadow-[#581c44]/20 hover:bg-[#3d142f] hover:scale-105 active:scale-95 transition-all text-[11px] md:text-sm px-4 md:px-8 py-3 md:py-4 rounded-lg flex items-center justify-center gap-2 font-black uppercase tracking-tight">
                        <PlusCircle size={20} /> Create GST Invoice
                    </Link>
                </div>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div className="group stats-card border-none bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-blue-200/40 relative overflow-hidden transition-all duration-500">
                    <div className="z-10 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-[#fcf8f1] border border-[#d4af37]/30 rounded-lg group-hover:bg-[#581c44] group-hover:text-white transition-all duration-500">
                                <DollarSign size={24} />
                            </div>
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-black uppercase tracking-tighter">TOTAL REVENUE</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 italic leading-none truncate">₹{(stats.revenue || 0).toLocaleString()}</h2>
                    </div>
                </div>

                <div className="group stats-card border-none bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-green-200/40 relative overflow-hidden transition-all duration-500">
                    <div className="z-10 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-green-50 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                                <Zap size={24} />
                            </div>
                            <span className="text-[10px] bg-green-50 text-green-700 px-3 py-1 rounded-full font-black uppercase tracking-tighter">TODAY SALES</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 italic leading-none truncate">₹{(stats.todaySales || 0).toLocaleString()}</h2>
                    </div>
                </div>

                <div className="group stats-card border-none bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-indigo-200/40 relative overflow-hidden transition-all duration-500">
                    <div className="z-10 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                <Users size={24} />
                            </div>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black uppercase tracking-tighter">CUSTOMERS</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 italic leading-none truncate">{stats.totalCustomers || 0}</h2>
                    </div>
                </div>

                <div className="group stats-card border-none bg-white p-6 shadow-xl shadow-slate-200/50 hover:shadow-orange-200/40 relative overflow-hidden transition-all duration-500">
                    <div className="z-10 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                                <Target size={24} />
                            </div>
                            <span className="text-[10px] bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-black uppercase tracking-tighter">TOTAL TAX</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 italic leading-none truncate">₹{(stats.tax || 0).toLocaleString()}</h2>
                    </div>
                </div>
            </div>

            {/* Main Visual Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12 items-stretch">
                <div className="lg:col-span-2 glass-card p-10 bg-white shadow-2xl shadow-slate-200/40 flex flex-col">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black text-[#581c44] italic tracking-tighter uppercase">PAYMENT DISTRIBUTION</h3>
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <FileText size={16} /> DATA SYNCED WITH PRASTHAN SERVERS
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc', radius: 10}} 
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '15px' }} 
                                />
                                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-10 bg-white border border-slate-100 shadow-2xl flex flex-col">
                    <h3 className="text-xl font-black italic tracking-tighter mb-8 text-[#581c44] uppercase">Billing Analysis</h3>
                    <div className="space-y-6 flex-1 flex flex-col justify-center">
                        <Link to="/add-gst-bill" className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 flex items-center justify-between group transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform text-white"><FileText size={24} /></div>
                                <div>
                                    <p className="text-lg font-black uppercase leading-none tracking-tight text-slate-800">GST Bills</p>
                                    <p className="text-[10px] text-blue-600 font-black tracking-widest mt-2 uppercase">{stats.gstCount || 0} INVOICES</p>
                                </div>
                            </div>
                            <ArrowRight className="text-blue-300 group-hover:text-blue-600 transition-colors" />
                        </Link>
                        <Link to="/add-nongst-bill" className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100 flex items-center justify-between group transition-all hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100 cursor-pointer">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-purple-600 rounded-2xl shadow-xl shadow-purple-200 group-hover:scale-110 transition-transform text-white"><Zap size={24} /></div>
                                <div>
                                    <p className="text-lg font-black uppercase leading-none tracking-tight text-slate-800">Non-GST</p>
                                    <p className="text-[10px] text-purple-600 font-black tracking-widest mt-2 uppercase">{stats.nonGstCount || 0} INVOICES</p>
                                </div>
                            </div>
                            <ArrowRight className="text-purple-300 group-hover:text-purple-600 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Table */}
            <div className="glass-card overflow-hidden bg-white shadow-2xl shadow-slate-200/40">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                        <h3 className="text-xl font-black text-slate-800 italic tracking-tighter uppercase">Recent Invoices</h3>
                    </div>
                    <Link to="/bills" className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                        View Full History <ArrowUpRight size={16} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-8 py-6">ID NUMBER</th>
                                <th className="px-8 py-6">CLIENT ENTITY</th>
                                <th className="px-8 py-6">ISSUE DATE</th>
                                <th className="px-8 py-6 text-right">VALUATION</th>
                                <th className="px-8 py-6 text-center">PAYMENT STATE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentBills.map((bill) => (
                                <tr key={bill._id} className="hover:bg-slate-50/80 transition-all cursor-pointer group" onClick={() => navigate(`/view-bill/${bill._id}`)}>
                                    <td className="px-8 py-6 font-black text-slate-800 italic">{bill.billNo}</td>
                                    <td className="px-8 py-6 text-slate-500 font-bold tracking-tight uppercase text-xs">{bill.clientName}</td>
                                    <td className="px-8 py-6 text-slate-400 font-bold text-xs">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-8 py-6 text-right font-black text-slate-900 italic">₹{(bill.totalAmount || 0).toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 ${
                                                bill.status === 'Paid' ? 'border-green-50 bg-green-50 text-green-700' : 
                                                bill.status === 'Unpaid' ? 'border-red-50 bg-red-50 text-red-700' : 'border-amber-50 bg-amber-50 text-amber-700'
                                            }`}>
                                                {bill.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
