import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Search, MapPin, Loader2, Users, FileText } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/bills/customers');
            setCustomers(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error('Could not load customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.gstin && c.gstin.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Layout>
            <div className="mb-5">
                <div className="relative w-full max-w-sm">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        className="w-full border border-[#dde3f5] rounded-md text-sm pl-9 pr-4 py-2.5 outline-none focus:border-[#465aa8] bg-white text-gray-800 placeholder:text-gray-400 transition-colors"
                        placeholder="Search by name or GSTIN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center gap-2 py-20 text-gray-400 text-sm">
                    <Loader2 size={18} className="animate-spin" /> Loading customers...
                </div>
            ) : filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Users size={36} className="text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">No customers found.</p>
                    <p className="text-xs text-gray-300 mt-1">Create an invoice to add customers.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredCustomers.map((customer) => (
                            <div key={customer._id} className="bg-white border border-[#dde3f5] rounded-lg p-5 hover:border-[#465aa8] transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[#465aa8] text-white flex items-center justify-center text-sm font-bold shrink-0">
                                        {customer.name[0]?.toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{customer.name}</p>
                                        {customer.gstin ? (
                                            <p className="text-xs text-[#465aa8] truncate">GSTIN: {customer.gstin}</p>
                                        ) : (
                                            <p className="text-xs text-gray-400">No GSTIN</p>
                                        )}
                                    </div>
                                </div>

                                {customer.address && (
                                    <div className="flex items-start gap-2 mb-4 text-xs text-gray-500">
                                        <MapPin size={13} className="mt-0.5 shrink-0 text-gray-400" />
                                        <span className="line-clamp-2">{customer.address}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#eef1fa] mb-4">
                                    <div className="text-center">
                                        <p className="text-[11px] text-gray-400 mb-0.5">Bills</p>
                                        <p className="text-sm font-bold text-gray-800">{customer.totalBills}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] text-gray-400 mb-0.5">Revenue</p>
                                        <p className="text-sm font-bold text-gray-800">₹{(customer.totalSpent || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[11px] text-gray-400 mb-0.5">Since</p>
                                        <p className="text-sm font-bold text-gray-800">{new Date(customer.lastBillDate).getFullYear()}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/bills?search=${encodeURIComponent(customer.name)}`)}
                                    className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-[#465aa8] border border-[#dde3f5] hover:bg-[#f0f4ff] hover:border-[#465aa8] py-2 rounded-md transition-all"
                                >
                                    <FileText size={13} /> View Bills
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-4">{filteredCustomers.length} customer{filteredCustomers.length > 1 ? 's' : ''} found</p>
                </>
            )}
        </Layout>
    );
};

export default Customers;
