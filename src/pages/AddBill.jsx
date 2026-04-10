import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, Plus, Save } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const AddBill = ({ isGst }) => {
    const [searchParams] = useSearchParams();
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
        if (isGst !== undefined) {
            setIsGstEnabled(isGst);
            if (!isGst) setClientGSTIN('');
        } else {
            const type = searchParams.get('type') || 'gst';
            setIsGstEnabled(type === 'gst');
            if (type !== 'gst') setClientGSTIN('');
        }
    }, [isGst, searchParams]);

    const addItem = () => setItems([...items, { description: '', hsnCode: '', qty: 1, rate: 0, gstRate: 18 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/bills', { clientName, clientAddress, clientGSTIN, isGstEnabled, status, items });
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
            <form onSubmit={handleSubmit} className="space-y-4 pb-10">

                <div className="bg-white border border-[#dde3f5] rounded-lg p-5">
                    <h2 className="text-sm font-semibold text-[#465aa8] mb-4 pb-3 border-b border-[#dde3f5]">Client Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Client Name <span className="text-red-500">*</span></label>
                            <input type="text" className="input-field text-sm" placeholder="Full name or company"
                                value={clientName} onChange={(e) => setClientName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Status</label>
                            <select className="input-field text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                            </select>
                        </div>
                        {isGstEnabled && (
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">GSTIN <span className="text-red-500">*</span></label>
                                <input type="text" className="input-field text-sm" placeholder="09XXXXX..."
                                    value={clientGSTIN} onChange={(e) => setClientGSTIN(e.target.value)} required />
                            </div>
                        )}
                        <div className={isGstEnabled ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-2'}>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                            <textarea className="input-field text-sm resize-none" placeholder="Complete client address"
                                value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} rows={2} />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-[#dde3f5] rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#dde3f5]">
                        <h2 className="text-sm font-semibold text-[#465aa8]">Items</h2>
                        <button type="button" onClick={addItem}
                            className="flex items-center gap-1.5 text-xs font-medium text-[#465aa8] border border-[#dde3f5] bg-[#f0f4ff] hover:bg-[#e8eeff] px-3 py-1.5 rounded-md transition-all">
                            <Plus size={13} /> Add Item
                        </button>
                    </div>

                    <div className={`hidden md:grid gap-3 px-2 mb-2 text-xs font-medium text-gray-400 ${isGstEnabled ? 'grid-cols-[2fr_0.8fr_0.6fr_0.8fr_0.6fr_36px]' : 'grid-cols-[2.5fr_0.8fr_0.6fr_1fr_36px]'}`}>
                        <span>Description</span><span>HSN Code</span><span>Qty</span><span>Rate (₹)</span>
                        {isGstEnabled && <span>GST %</span>}<span />
                    </div>

                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className={`grid grid-cols-1 md:grid gap-3 md:items-center p-3 md:p-0 bg-[#f0f4ff] md:bg-transparent rounded-md md:rounded-none border border-[#dde3f5] md:border-0 ${isGstEnabled ? 'md:grid-cols-[2fr_0.8fr_0.6fr_0.8fr_0.6fr_36px]' : 'md:grid-cols-[2.5fr_0.8fr_0.6fr_1fr_36px]'}`}>
                                <div>
                                    <label className="block text-[10px] text-gray-400 mb-1 md:hidden">Description</label>
                                    <input type="text" className="input-field text-sm" placeholder="Service / Product"
                                        value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 mb-1 md:hidden">HSN Code</label>
                                    <input type="text" className="input-field text-sm" placeholder="Optional"
                                        value={item.hsnCode} onChange={(e) => handleItemChange(index, 'hsnCode', e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 mb-1 md:hidden">Qty</label>
                                    <input type="number" className="input-field text-sm"
                                        value={item.qty} onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)} required />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 mb-1 md:hidden">Rate (₹)</label>
                                    <input type="number" className="input-field text-sm"
                                        value={item.rate} onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} required />
                                </div>
                                {isGstEnabled && (
                                    <div>
                                        <label className="block text-[10px] text-gray-400 mb-1 md:hidden">GST %</label>
                                        <input type="number" className="input-field text-sm"
                                            value={item.gstRate} onChange={(e) => handleItemChange(index, 'gstRate', parseFloat(e.target.value) || 0)} />
                                    </div>
                                )}
                                <div className="flex justify-end md:justify-center">
                                    <button type="button" onClick={() => removeItem(index)} disabled={items.length === 1}
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#dde3f5]">
                        <p className="text-xs text-gray-400">{items.length} item{items.length > 1 ? 's' : ''} · Invoice number auto-generated</p>
                        <button type="submit" disabled={submitting}
                            className="flex items-center gap-2 text-xs font-medium text-white bg-[#465aa8] hover:bg-[#3a4d96] px-5 py-2.5 rounded-md transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                            <Save size={14} />{submitting ? 'Saving...' : 'Save & Generate'}
                        </button>
                    </div>
                </div>

            </form>
        </Layout>
    );
};

export default AddBill;
