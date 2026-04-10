import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { FileText, ArrowUpRight, Users, TrendingUp, Receipt, Zap } from 'lucide-react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white border border-[#dde3f5] rounded-lg p-4 flex items-center gap-4">
        <div className={`p-2.5 rounded-md ${color}`}>
            <Icon size={18} className="text-white" />
        </div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-lg font-bold text-[#1e2a4a]">{value}</p>
        </div>
    </div>
);

const SkeletonCard = () => (
    <div className="bg-white border border-[#dde3f5] rounded-lg p-4 flex items-center gap-4 animate-pulse">
        <div className="w-10 h-10 bg-gray-100 rounded-md" />
        <div className="space-y-2">
            <div className="h-3 w-20 bg-gray-100 rounded" />
            <div className="h-5 w-24 bg-gray-100 rounded" />
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentBills, setRecentBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, billsRes] = await Promise.all([
                    api.get('/bills/stats'),
                    api.get('/bills?limit=5')
                ]);
                setStats(statsRes.data);
                setRecentBills(Array.isArray(billsRes.data) ? billsRes.data.slice(0, 5) : []);
            } catch {
                toast.error('Error fetching dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const barData = [
        { name: 'Paid', value: stats?.paid || 0 },
        { name: 'Unpaid', value: stats?.unpaid || 0 },
        { name: 'Pending', value: stats?.pending || 0 },
    ];
    const BAR_COLORS = ['#38b45c', '#e53e3e', '#d97706'];

    return (
        <Layout>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    <>
                        <StatCard label="Total Revenue" value={`₹${(stats?.revenue || 0).toLocaleString()}`} icon={TrendingUp} color="bg-[#465aa8]" />
                        <StatCard label="Today's Sales" value={`₹${(stats?.todaySales || 0).toLocaleString()}`} icon={Zap} color="bg-[#38b45c]" />
                        <StatCard label="Customers" value={stats?.totalCustomers || 0} icon={Users} color="bg-[#465aa8]" />
                        <StatCard label="Total Tax" value={`₹${(stats?.tax || 0).toLocaleString()}`} icon={Receipt} color="bg-[#38b45c]" />
                    </>
                )}
            </div>

            {/* Chart + Bill Type */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div className="lg:col-span-2 bg-white border border-[#dde3f5] rounded-lg p-5">
                    <h3 className="text-sm font-semibold text-[#465aa8] mb-4">Payment Distribution</h3>
                    {loading ? (
                        <div className="h-52 bg-gray-50 rounded animate-pulse" />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1fa" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip
                                    cursor={{ fill: '#f0f4ff' }}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #dde3f5', fontSize: 12 }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={48}>
                                    {barData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="bg-white border border-[#dde3f5] rounded-lg p-5 flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-[#465aa8]">Bill Summary</h3>
                    <Link to="/add-gst-bill" className="flex items-center justify-between p-3 rounded-md border border-[#dde3f5] bg-[#f0f4ff] hover:border-[#465aa8] transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#465aa8] rounded-md text-white"><FileText size={15} /></div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">GST Bills</p>
                                <p className="text-xs text-[#465aa8]">{loading ? '...' : `${stats?.gstCount || 0} invoices`}</p>
                            </div>
                        </div>
                        <ArrowUpRight size={15} className="text-[#465aa8] opacity-50 group-hover:opacity-100" />
                    </Link>
                    <Link to="/add-nongst-bill" className="flex items-center justify-between p-3 rounded-md border border-[#dde3f5] bg-[#f0fff5] hover:border-[#38b45c] transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#38b45c] rounded-md text-white"><Zap size={15} /></div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Non-GST Bills</p>
                                <p className="text-xs text-[#38b45c]">{loading ? '...' : `${stats?.nonGstCount || 0} invoices`}</p>
                            </div>
                        </div>
                        <ArrowUpRight size={15} className="text-[#38b45c] opacity-50 group-hover:opacity-100" />
                    </Link>
                    <div className="mt-auto pt-3 border-t border-[#dde3f5] grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-xs text-gray-400">Total</p>
                            <p className="text-sm font-bold text-gray-800">{loading ? '-' : stats?.count || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Paid</p>
                            <p className="text-sm font-bold text-[#38b45c]">{loading ? '-' : stats?.paid || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Unpaid</p>
                            <p className="text-sm font-bold text-red-500">{loading ? '-' : stats?.unpaid || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bills Table */}
            <div className="bg-white border border-[#dde3f5] rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#dde3f5]">
                    <h3 className="text-sm font-semibold text-[#465aa8]">Recent Invoices</h3>
                    <Link to="/bills" className="text-xs text-[#465aa8] hover:underline flex items-center gap-1">
                        View all <ArrowUpRight size={13} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-5 space-y-3">
                            {Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-8 bg-gray-50 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : recentBills.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-10">No bills found</p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-[#f0f4ff] text-xs text-gray-500 border-b border-[#dde3f5]">
                                    <th className="px-5 py-3 font-medium">Bill No.</th>
                                    <th className="px-5 py-3 font-medium">Client</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                                    <th className="px-5 py-3 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eef1fa]">
                                {recentBills.map((bill) => (
                                    <tr key={bill._id} className="hover:bg-[#f0f4ff] cursor-pointer transition-colors" onClick={() => navigate(`/view-bill/${bill._id}`)}>
                                        <td className="px-5 py-3 font-medium text-gray-800">{bill.billNo}</td>
                                        <td className="px-5 py-3 text-gray-600">{bill.clientName}</td>
                                        <td className="px-5 py-3 text-gray-400 text-xs">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-gray-800">₹{(bill.totalAmount || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                                                bill.status === 'Paid' ? 'bg-green-50 text-[#38b45c]' :
                                                bill.status === 'Unpaid' ? 'bg-red-50 text-red-500' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>{bill.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
