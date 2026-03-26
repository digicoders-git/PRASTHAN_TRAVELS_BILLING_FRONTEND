import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, CheckCircle, FileText, User, MapPin, Hash, Tally3 } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const ViewBill = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const { data } = await api.get(`/bills/${id}`);
                setBill(data);
            } catch (err) {
                toast.error('Bill not found');
                navigate('/bills');
            } finally {
                setLoading(false);
            }
        };
        fetchBill();
    }, [id, navigate]);

    const handleDownload = async () => {
        const toastId = toast.loading('Exporting PDF document...');
        try {
            const response = await api.get(`/pdf/generate/${id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bill-${bill.billNo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.update(toastId, { render: 'Document generated successfully!', type: 'success', isLoading: false, autoClose: 2000 });
        } catch (err) {
            console.error('PDF Download Error:', err);
            const errMsg = err.response?.data?.message || 'Check Server Configuration';
            toast.update(toastId, { 
                render: `Failed to generate PDF: ${errMsg}`, 
                type: 'error', 
                isLoading: false, 
                autoClose: 3000 
            });
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/bills" className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">Invoice Detail</h1>
                        <p className="text-slate-500">Previewing record for bill {bill.billNo}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleDownload} className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
                        <Download size={18} /> Download PDF
                    </button>
                    <button onClick={() => window.print()} className="btn btn-primary">
                        <Printer size={18} /> Print Record
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Bill Data */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card p-8 bg-white border border-slate-100">
                        <div className="flex justify-between items-start mb-10 border-b border-slate-100 pb-8">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl uppercase tracking-tighter">
                                <Tally3 size={32} /> GSP BILLING
                            </div>
                            <div className="text-right">
                                <h4 className="text-2xl font-black text-slate-800 uppercase italic mb-1">INVOICE</h4>
                                <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">No. {bill.billNo}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-10 mb-10">
                            <div className="space-y-4">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Billed To</h5>
                                <div>
                                    <p className="font-extrabold text-slate-900 text-lg uppercase">{bill.clientName}</p>
                                    <p className="text-sm text-slate-500 mt-1 flex items-start gap-2 max-w-xs leading-relaxed"><MapPin size={14} className="mt-1 shrink-0" /> {bill.clientAddress}</p>
                                    {bill.clientGSTIN && <p className="text-xs font-bold text-blue-600 mt-3 flex items-center gap-2"><Hash size={14} /> GSTIN: {bill.clientGSTIN}</p>}
                                </div>
                            </div>
                            <div className="space-y-4 text-right">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Issue Date</h5>
                                <p className="font-bold text-slate-700 text-lg uppercase tracking-tight">{new Date(bill.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left mb-10">
                                <thead>
                                    <tr className="bg-slate-900 text-white rounded-lg">
                                        <th className="px-6 py-4 rounded-l-lg text-xs font-bold uppercase tracking-widest">Description</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Qty</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest">Rate</th>
                                        <th className="px-6 py-4 rounded-r-lg text-xs font-bold uppercase tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {bill.items.map((item, id) => (
                                        <tr key={id} className="text-slate-600 font-medium">
                                            <td className="px-6 py-4 font-semibold">{item.description}</td>
                                            <td className="px-6 py-4">{item.qty}</td>
                                            <td className="px-6 py-4">₹{item.rate.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-900">₹{item.total.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col md:items-end space-y-4 border-t border-slate-100 pt-8 mt-10">
                            <div className="w-full md:w-80 space-y-3">
                                <div className="flex justify-between text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    <span>Sub Total</span>
                                    <span>₹{bill.subTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    <span>CGST (9%)</span>
                                    <span>₹{bill.cgstAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-bold uppercase tracking-widest text-xs border-b border-slate-100 pb-3">
                                    <span>SGST (9%)</span>
                                    <span>₹{bill.sgstAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-900 text-xl font-black italic bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                                    <span>GRAND TOTAL</span>
                                    <span className="text-blue-700">₹{bill.totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    <section className="glass-card p-8 bg-white border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Payment Tracking</h4>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Current Status</label>
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${
                                    bill.status === 'Paid' ? 'border-emerald-50 bg-emerald-50 text-emerald-700' : 
                                    bill.status === 'Unpaid' ? 'border-rose-50 bg-rose-50 text-rose-700' : 'border-amber-50 bg-amber-50 text-amber-700'
                                }`}>
                                    {bill.status === 'Paid' && <CheckCircle size={14} />}
                                    {bill.status} Invoice
                                </span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Savings/Tax Deductions</p>
                                <p className="text-lg font-black text-slate-800 italic">₹{bill.totalTax.toLocaleString()}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default ViewBill;
