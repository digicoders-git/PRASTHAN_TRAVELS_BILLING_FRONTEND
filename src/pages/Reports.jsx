import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
    Calendar, Download, FileSpreadsheet, TrendingUp, 
    PieChart, DollarSign, Filter, RefreshCw, Loader2,
    ArrowUpRight, ArrowDownRight, Clock, FileWarning
} from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const Reports = () => {
    const [fromDate, setFromDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ revenue: 0, tax: 0, bills: 0, nonGst: 0 });

    const fetchReport = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/bills?from=${fromDate}&to=${toDate}`);
            const bills = Array.isArray(data) ? data : [];
            setReportData(bills);
            
            // Period Stats
            const totalRevenue = bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
            const totalTax = bills.reduce((sum, b) => sum + (b.totalTax || 0), 0);
            const nonGstTotal = bills.filter(b => !b.isGstEnabled).reduce((sum, b) => sum + (b.totalAmount || 0), 0);
            
            setStats({
                revenue: totalRevenue,
                tax: totalTax,
                bills: bills.length,
                nonGst: nonGstTotal
            });
        } catch (err) {
            toast.error('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const exportToCSV = () => {
        if (reportData.length === 0) return toast.warning('No data to export');
        const headers = ['Date', 'Invoice No', 'Client', 'GST Type', 'Subtotal', 'Tax', 'Total Amount', 'Status'];
        const rows = reportData.map(b => [
            new Date(b.createdAt).toLocaleDateString(),
            b.billNo,
            `"${b.clientName}"`,
            b.isGstEnabled ? 'GST' : 'NON-GST',
            b.subTotal,
            b.totalTax,
            b.totalAmount,
            b.status
        ]);
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Report_${fromDate}_to_${toDate}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#581c44] tracking-tighter italic uppercase">Financial Audit</h1>
                    <p className="text-[#6d4c41]/60 font-bold uppercase text-[10px] tracking-widest mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#d4af37] rounded-full shadow-sm"></span>
                        Precision Ledger v4.1
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white/50 p-3 rounded-2xl border border-[#e5dbcd] shadow-sm">
                    <div className="flex items-center gap-2 bg-white p-2.5 px-4 rounded-xl shadow-inner border border-slate-100">
                        <Calendar size={14} className="text-[#d4af37]" />
                        <input type="date" className="outline-none font-black text-[11px] text-[#581c44] bg-transparent uppercase tracking-wider" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </div>
                    <span className="text-[#d4af37] font-black text-[10px] uppercase italic">to</span>
                    <div className="flex items-center gap-2 bg-white p-2.5 px-4 rounded-xl shadow-inner border border-slate-100">
                        <Calendar size={14} className="text-[#d4af37]" />
                        <input type="date" className="outline-none font-black text-[11px] text-[#581c44] bg-transparent uppercase tracking-wider" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </div>
                    
                    <div className="h-8 w-px bg-[#e5dbcd] mx-1 hidden md:block"></div>

                    <div className="flex items-center gap-2">
                        <button onClick={fetchReport} className="p-3 bg-[#581c44] text-white rounded-xl hover:bg-[#3d142f] transition-all shadow-lg shadow-[#581c44]/10 active:scale-90">
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={exportToCSV} className="bg-[#1a0a14] text-white p-3 px-6 rounded-xl flex items-center gap-2 hover:bg-[#581c44] transition-all font-black uppercase text-[10px] tracking-[0.15em] shadow-lg active:scale-95">
                            <FileSpreadsheet size={16} className="text-[#d4af37]" /> Export CSV
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Total Revenue */}
                <div className="glass-card p-6 bg-white border-none shadow-lg border-l-4 border-l-[#581c44]">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp size={20} className="text-[#581c44]" />
                        <span className="text-[10px] font-black uppercase text-[#6d4c41]/50 tracking-widest">Total Revenue</span>
                    </div>
                    <div className="text-2xl font-black italic tracking-tighter text-[#581c44]">₹{stats.revenue.toLocaleString('en-IN')}</div>
                    <p className="text-[9px] font-bold uppercase mt-1 text-[#581c44]/60">Combined Volume</p>
                </div>

                {/* GST Contribution */}
                <div className="glass-card p-6 bg-white border-none shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign size={20} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">GST Collected</span>
                    </div>
                    <div className="text-2xl font-black italic tracking-tighter text-slate-800">₹{stats.tax.toLocaleString('en-IN')}</div>
                    <p className="text-[9px] font-bold uppercase mt-1 text-green-600">Tax Liabilities</p>
                </div>

                {/* Non-GST Contribution */}
                <div className="glass-card p-6 bg-white border-none shadow-lg border-l-4 border-l-[#d4af37]">
                    <div className="flex items-center justify-between mb-2">
                        <FileWarning size={20} className="text-[#d4af37]" />
                        <span className="text-[10px] font-black uppercase text-[#6d4c41]/50 tracking-widest">Non-GST Sales</span>
                    </div>
                    <div className="text-2xl font-black italic tracking-tighter text-slate-800">₹{stats.nonGst.toLocaleString('en-IN')}</div>
                    <p className="text-[9px] font-bold uppercase mt-1 text-[#d4af37]">Direct Revenue</p>
                </div>

                {/* Data Volume */}
                <div className="glass-card p-6 bg-white border-none shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Clock size={20} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reports Count</span>
                    </div>
                    <div className="text-2xl font-black italic tracking-tighter text-slate-800">{stats.bills}</div>
                    <p className="text-[9px] font-bold uppercase mt-1 text-slate-400">Total Entries</p>
                </div>
            </div>

            <div className="glass-card bg-white border-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                    <h3 className="font-black italic uppercase text-slate-400 tracking-widest text-xs">Financial Audit Trail</h3>
                </div>
                {loading ? (
                    <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#1a0a14] text-white uppercase text-[9px] font-black tracking-[0.2em]">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Invoice</th>
                                    <th className="p-4">Client</th>
                                    <th className="p-4">Tax (GST)</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-bold text-xs">
                                {reportData.length > 0 ? reportData.map((b) => (
                                    <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-tighter ${b.isGstEnabled ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {b.isGstEnabled ? 'GST' : 'NON-GST'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-black italic text-slate-800">{b.billNo}</td>
                                        <td className="p-4 text-slate-600 truncate max-w-[150px]">{b.clientName}</td>
                                        <td className="p-4 text-green-600/70">₹{(b.totalTax || 0).toLocaleString()}</td>
                                        <td className="p-4 font-black text-slate-800 italic">₹{b.totalAmount.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                b.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="7" className="p-20 text-center text-slate-400 italic">Empty Period</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Reports;
