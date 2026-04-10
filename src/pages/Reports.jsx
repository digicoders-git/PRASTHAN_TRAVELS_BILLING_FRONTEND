import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Calendar, FileSpreadsheet, TrendingUp, DollarSign, FileWarning, Clock, RefreshCw, Loader2 } from 'lucide-react';
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
            setStats({
                revenue: bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
                tax: bills.reduce((sum, b) => sum + (b.totalTax || 0), 0),
                bills: bills.length,
                nonGst: bills.filter(b => !b.isGstEnabled).reduce((sum, b) => sum + (b.totalAmount || 0), 0)
            });
        } catch {
            toast.error('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReport(); }, []);

    const exportToCSV = () => {
        if (reportData.length === 0) return toast.warning('No data to export');
        const headers = ['Date', 'Invoice No', 'Client', 'GST Type', 'Subtotal', 'Tax', 'Total Amount', 'Status'];
        const rows = reportData.map(b => [
            new Date(b.createdAt).toLocaleDateString(),
            b.billNo, `"${b.clientName}"`,
            b.isGstEnabled ? 'GST' : 'NON-GST',
            b.subTotal, b.totalTax, b.totalAmount, b.status
        ]);
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `Report_${fromDate}_to_${toDate}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const statusStyle = (status) => {
        if (status === 'Paid') return 'bg-green-50 text-[#38b45c]';
        if (status === 'Unpaid') return 'bg-red-50 text-red-500';
        return 'bg-amber-50 text-amber-600';
    };

    return (
        <Layout>
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="flex items-center gap-2 bg-white border border-[#dde3f5] rounded-md px-3 py-2">
                    <Calendar size={14} className="text-gray-400" />
                    <input type="date" className="outline-none text-sm text-gray-700 bg-transparent" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <span className="text-xs text-gray-400">to</span>
                <div className="flex items-center gap-2 bg-white border border-[#dde3f5] rounded-md px-3 py-2">
                    <Calendar size={14} className="text-gray-400" />
                    <input type="date" className="outline-none text-sm text-gray-700 bg-transparent" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <button onClick={fetchReport} className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#465aa8] hover:bg-[#3a4d96] px-3 py-2 rounded-md transition-all">
                    <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Apply
                </button>
                <button onClick={exportToCSV} className="flex items-center gap-1.5 text-xs font-medium text-[#465aa8] border border-[#dde3f5] hover:bg-[#f0f4ff] hover:border-[#465aa8] px-3 py-2 rounded-md transition-all">
                    <FileSpreadsheet size={13} /> Export CSV
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <div className="bg-white border border-[#dde3f5] rounded-lg p-4 flex items-center gap-3">
                    <div className="p-2 bg-[#465aa8] rounded-md"><TrendingUp size={16} className="text-white" /></div>
                    <div>
                        <p className="text-xs text-gray-400">Total Revenue</p>
                        <p className="text-sm font-bold text-gray-800">₹{stats.revenue.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="bg-white border border-[#dde3f5] rounded-lg p-4 flex items-center gap-3">
                    <div className="p-2 bg-[#38b45c] rounded-md"><DollarSign size={16} className="text-white" /></div>
                    <div>
                        <p className="text-xs text-gray-400">GST Collected</p>
                        <p className="text-sm font-bold text-gray-800">₹{stats.tax.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="bg-white border border-[#dde3f5] rounded-lg p-4 flex items-center gap-3">
                    <div className="p-2 bg-[#d97706] rounded-md"><FileWarning size={16} className="text-white" /></div>
                    <div>
                        <p className="text-xs text-gray-400">Non-GST Sales</p>
                        <p className="text-sm font-bold text-gray-800">₹{stats.nonGst.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="bg-white border border-[#dde3f5] rounded-lg p-4 flex items-center gap-3">
                    <div className="p-2 bg-[#465aa8] rounded-md"><Clock size={16} className="text-white" /></div>
                    <div>
                        <p className="text-xs text-gray-400">Total Bills</p>
                        <p className="text-sm font-bold text-gray-800">{stats.bills}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#dde3f5] rounded-lg overflow-hidden">
                <div className="px-5 py-3 border-b border-[#dde3f5]">
                    <h3 className="text-sm font-semibold text-[#465aa8]">Report Details</h3>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
                        <Loader2 size={18} className="animate-spin" /> Loading report...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[700px]">
                            <thead>
                                <tr className="bg-[#f0f4ff] border-b border-[#dde3f5] text-xs font-medium text-gray-500">
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Type</th>
                                    <th className="px-5 py-3">Invoice</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3">Tax (GST)</th>
                                    <th className="px-5 py-3 text-right">Amount</th>
                                    <th className="px-5 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eef1fa]">
                                {reportData.length === 0 ? (
                                    <tr><td colSpan="7" className="px-5 py-14 text-center text-gray-400">No data for selected period.</td></tr>
                                ) : reportData.map((b) => (
                                    <tr key={b._id} className="hover:bg-[#f0f4ff] transition-colors">
                                        <td className="px-5 py-3 text-gray-400 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${b.isGstEnabled ? 'bg-[#f0f4ff] text-[#465aa8]' : 'bg-gray-100 text-gray-500'}`}>
                                                {b.isGstEnabled ? 'GST' : 'Non-GST'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 font-medium text-gray-800">{b.billNo}</td>
                                        <td className="px-5 py-3 text-gray-600 truncate max-w-[150px]">{b.clientName}</td>
                                        <td className="px-5 py-3 text-gray-600">₹{(b.totalTax || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-gray-800">₹{(b.totalAmount || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusStyle(b.status)}`}>{b.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && reportData.length > 0 && (
                    <div className="px-5 py-2.5 border-t border-[#dde3f5] bg-[#f0f4ff]">
                        <p className="text-xs text-gray-400">{reportData.length} record{reportData.length > 1 ? 's' : ''} found</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Reports;
