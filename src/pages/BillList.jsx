import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
    FileText, Search, Download, Trash2, ArrowLeft, Filter, 
    Loader2, Calendar, CheckCircle, XCircle, Clock, UserCircle, PlusCircle
} from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

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
            if (Array.isArray(data)) {
                setBills(data);
            } else {
                setBills([]);
            }
        } catch (err) {
            console.error('Fetch Bills Error:', err);
            toast.error('Could not load bills. Check connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(fetchBills, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterStatus]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/bills/${id}`);
                setBills(bills.filter(b => b._id !== id));
                toast.success('Bill deleted');
            } catch (err) {
                toast.error('Delete failed');
            }
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
            console.error('PDF Download Error:', err);
            const errMsg = err.response?.data?.message || 'Check Server Configuration';
            toast.error(`PDF Fail: ${errMsg}`);
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#e5dbcd]">
                <h1 className="text-3xl font-extrabold text-[#581c44] tracking-tighter italic uppercase">Invoice Ledger</h1>
                <Link to="/add-bill" className="btn bg-[#581c44] text-white p-3 px-8 rounded-lg shadow-lg shadow-[#581c44]/10 hover:bg-[#3d142f] transition-all flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
                    <PlusCircle size={16} className="text-[#d4af37]" /> New Invoice
                </Link>
            </div>

            <div className="bg-white p-5 rounded-lg border border-[#e5dbcd] shadow-sm mb-8 flex gap-4">
                <div className="flex-1 relative flex items-center">
                    <Search className="absolute left-4 text-[#6d4c41]/30" size={18} />
                    <input 
                        type="text" 
                        className="w-full border border-[#e5dbcd]/50 p-3 pl-12 rounded-lg outline-none focus:border-[#d4af37] font-bold text-[#1a0a14] placeholder:text-[#6d4c41]/30 bg-[#fcf8f1]/30" 
                        placeholder="Search invoice number or client..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select className="border border-[#e5dbcd]/50 p-3 px-5 rounded-lg w-52 font-bold text-[#1a0a14] outline-none focus:border-[#d4af37] bg-[#fcf8f1]/30" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="Paid">PAID</option>
                    <option value="Unpaid">UNPAID</option>
                    <option value="Pending">PENDING</option>
                </select>
            </div>

            <div className="bg-white rounded shadow overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-10 text-center">Loading...</div>
                ) : (
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-[#1a0a14] uppercase text-[10px] font-black text-white tracking-[0.2em]">
                            <tr>
                                <th className="p-5 border-b border-[#581c44]/30">Issue Date</th>
                                <th className="p-5 border-b border-[#581c44]/30">ID Number</th>
                                <th className="p-5 border-b border-[#581c44]/30">Client Name</th>
                                <th className="p-5 border-b border-[#581c44]/30">Valuation</th>
                                <th className="p-5 border-b border-[#581c44]/30 text-center">Status</th>
                                <th className="p-5 border-b border-[#581c44]/30 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {bills.length > 0 ? bills.map((bill) => (
                                <tr key={bill._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/view-bill/${bill._id}`)}>
                                    <td className="p-4 text-sm">{bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td className="p-4 font-bold">{bill.billNo}</td>
                                    <td className="p-4">{bill.clientName}</td>
                                    <td className="p-4 font-bold">₹{(bill.totalAmount || 0).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                            bill.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={(e) => handleDownload(bill._id, bill.billNo, e)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                                            <Download size={16} />
                                        </button>
                                        <button onClick={(e) => handleDelete(bill._id, e)} className="text-red-600 hover:bg-red-50 p-1 rounded">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="6" className="p-10 text-center text-gray-400">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
};

export default BillList;
