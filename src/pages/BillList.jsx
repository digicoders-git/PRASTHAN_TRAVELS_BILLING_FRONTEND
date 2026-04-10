import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Search, Download, Trash2, Loader2 } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const navigate = useNavigate();

    const fetchBills = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/bills?search=${encodeURIComponent(searchTerm)}&status=${filterStatus}`);
            setBills(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Could not load bills. Check connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const id = setTimeout(fetchBills, 300);
        return () => clearTimeout(id);
    }, [searchTerm, filterStatus]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/bills/${id}`);
            setBills(bills.filter(b => b._id !== id));
            toast.success('Bill deleted');
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleDownload = async (id, billNo, e) => {
        e.stopPropagation();
        try {
            toast.info('Downloading PDF...');
            const response = await api.get(`/pdf/generate/${id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bill-${billNo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            toast.error(`PDF Failed: ${err.response?.data?.message || 'Check server configuration'}`);
        }
    };

    const statusStyle = (status) => {
        if (status === 'Paid') return 'bg-green-50 text-[#38b45c]';
        if (status === 'Unpaid') return 'bg-red-50 text-red-500';
        return 'bg-amber-50 text-amber-600';
    };

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        className="input-field text-sm pl-9"
                        placeholder="Search by invoice no. or client name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="input-field text-sm sm:w-44" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Pending">Pending</option>
                </select>
            </div>

            <div className="bg-white border border-[#dde3f5] rounded-lg overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-sm">
                        <Loader2 size={18} className="animate-spin" /> Loading bills...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[640px]">
                            <thead>
                                <tr className="bg-[#f0f4ff] border-b border-[#dde3f5] text-xs font-medium text-gray-500">
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Bill No.</th>
                                    <th className="px-5 py-3">Client</th>
                                    <th className="px-5 py-3 text-right">Amount</th>
                                    <th className="px-5 py-3 text-center">Status</th>
                                    <th className="px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eef1fa]">
                                {bills.length === 0 ? (
                                    <tr><td colSpan="6" className="px-5 py-14 text-center text-gray-400">No bills found.</td></tr>
                                ) : bills.map((bill) => (
                                    <tr key={bill._id} className="hover:bg-[#f0f4ff] cursor-pointer transition-colors" onClick={() => navigate(`/view-bill/${bill._id}`)}>
                                        <td className="px-5 py-3 text-gray-400 text-xs">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-5 py-3 font-medium text-gray-800">{bill.billNo}</td>
                                        <td className="px-5 py-3 text-gray-600">{bill.clientName}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-gray-800">₹{(bill.totalAmount || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${statusStyle(bill.status)}`}>{bill.status}</span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={(e) => handleDownload(bill._id, bill.billNo, e)} className="p-1.5 text-gray-400 hover:text-[#465aa8] hover:bg-[#f0f4ff] rounded-md transition-all" title="Download PDF">
                                                    <Download size={15} />
                                                </button>
                                                <button onClick={(e) => handleDelete(bill._id, e)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all" title="Delete">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && bills.length > 0 && (
                    <div className="px-5 py-2.5 border-t border-[#dde3f5] bg-[#f0f4ff]">
                        <p className="text-xs text-gray-400">{bills.length} bill{bills.length > 1 ? 's' : ''} found</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BillList;
