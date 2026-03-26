import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Trash2, Plus, ArrowLeft, Save, PlusCircle, CheckCircle2 } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const AddBill = ({ isGst }) => {
    const [searchParams] = useSearchParams();
    // Use prop if available, otherwise fallback to search params
    const billType = isGst !== undefined ? (isGst ? 'gst' : 'nongst') : (searchParams.get('type') || 'gst');
    
    const [clientName, setClientName] = useState('');
    const [clientAddress, setClientAddress] = useState('');
    const [clientGSTIN, setClientGSTIN] = useState('');
    const [isGstEnabled, setIsGstEnabled] = useState(billType === 'gst');
    const [status, setStatus] = useState('Pending');
    const [items, setItems] = useState([{ description: '', hsnCode: '', qty: 1, rate: 0, gstRate: 18 }]);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Only react to props changes if provided
        if (isGst !== undefined) {
             setIsGstEnabled(isGst);
             if (!isGst) setClientGSTIN('');
        } else {
            const type = searchParams.get('type') || 'gst';
            setIsGstEnabled(type === 'gst');
            if (type !== 'gst') setClientGSTIN('');
        }
    }, [isGst, searchParams]);

    const addItem = () => {
        setItems([...items, { description: '', hsnCode: '', qty: 1, rate: 0, gstRate: 18 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/bills', {
                clientName,
                clientAddress,
                clientGSTIN,
                isGstEnabled,
                status,
                items
            });
            toast.success('Bill Created Successfully!');
            navigate('/bills');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create bill');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-white rounded-full transition-all text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#581c44] italic uppercase tracking-tighter">
                            {billType === 'gst' ? 'Generate GST Bill' : 'Generate Non-GST Bill'}
                        </h1>
                        <p className="text-[#6d4c41]/60 font-medium uppercase text-[10px] tracking-widest mt-1">
                            {billType === 'gst' ? 'Official Tax Invoice Implementation' : 'Proforma Estimate / Quotation Ledger'}
                        </p>
                    </div>
                </div>
                <button type="submit" form="bill-form" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : <><Save size={18} /> Save & Generate</>}
                </button>
            </div>

            <form id="bill-form" onSubmit={handleSubmit} className="space-y-8 pb-20">
                {/* Client Section */}
                <section className="glass-card p-8 bg-white">
                    <div className="flex items-center gap-2 mb-6 text-blue-700 font-bold border-b border-slate-100 pb-4">
                        <PlusCircle size={20} /> Client Information
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Client Name</label>
                            <input type="text" className="input-field" placeholder="Full name or company" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Payment Status</label>
                            <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 lg:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-slate-600">Address Details</label>
                            <textarea className="input-field" placeholder="Complete client address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} rows="2" />
                        </div>
                        {isGstEnabled && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-sm font-semibold text-[#6d4c41]">GSTIN (Required for GST)</label>
                                <input type="text" className="input-field" placeholder="09XXXXX..." value={clientGSTIN} onChange={(e) => setClientGSTIN(e.target.value)} required />
                            </div>
                        )}
                    </div>
                </section>

                {/* Items Section */}
                <section className="glass-card p-8 bg-white overflow-hidden">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2 text-blue-700 font-bold">
                            <PlusCircle size={20} /> Product & Services
                        </div>
                        <button type="button" onClick={addItem} className="text-sm font-bold text-blue-600 flex items-center gap-1.5 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
                            <Plus size={16} /> Add Item
                        </button>
                    </div>

                    <div className="overflow-x-auto -mx-8 px-8">
                        <div className="min-w-[800px] space-y-4">
                            <div className={`grid ${isGstEnabled ? 'grid-cols-[2.5fr_1fr_0.8fr_1fr_0.8fr_40px]' : 'grid-cols-[3fr_1fr_0.8fr_1.2fr_40px]'} gap-4 px-2 text-xs font-black text-[#6d4c41]/30 uppercase tracking-[0.1em]`}>
                                <div>Description</div>
                                <div>HSN CODE</div>
                                <div>Qty</div>
                                <div>Rate (₹)</div>
                                {isGstEnabled && <div>GST %</div>}
                                <div></div>
                            </div>

                             {items.map((item, index) => (
                                <div key={index} className={`grid ${isGstEnabled ? 'grid-cols-[2.5fr_1fr_0.8fr_1fr_0.8fr_40px]' : 'grid-cols-[3fr_1fr_0.8fr_1.2fr_40px]'} gap-4 items-start group animation-slide-up bg-[#fcf8f1]/30 p-2 rounded-lg border border-transparent transition-all`}>
                                    <input type="text" className="input-field bg-white" placeholder="Service/Product name" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required />
                                    <input type="text" className="input-field bg-white" placeholder="Optional" value={item.hsnCode} onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)} />
                                    <input type="number" className="input-field bg-white text-center" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)} required />
                                    <input type="number" className="input-field bg-white" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} required />
                                    {isGstEnabled && (
                                        <input type="number" className="input-field bg-white text-center" value={item.gstRate} onChange={(e) => handleItemChange(index, 'gstRate', parseFloat(e.target.value) || 0)} />
                                    )}
                                    <button type="button" onClick={() => removeItem(index)} className="p-2.5 text-[#6d4c41]/30 hover:text-[#8b0000] hover:bg-red-50 rounded-lg transition-all mt-1" disabled={items.length === 1}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Summary */}
                    <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:items-end">
                        <div className="w-full md:w-80 space-y-4">
                            <div className="flex justify-between text-slate-500">
                                <span>Selected Items:</span>
                                <span className="font-bold text-slate-800">{items.length}</span>
                            </div>
                            <div className="text-xs italic text-blue-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100 border-dashed flex items-start gap-2">
                                <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                                <span>Calculation and sequential invoice numbering will be handled automatically by the server.</span>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </Layout>
    );
};

export default AddBill;
