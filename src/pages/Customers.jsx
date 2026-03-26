import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
    Users, Search, UserCircle2, Phone, MapPin, 
    Calendar, CreditCard, ChevronRight, Loader2,
    Briefcase, Building2, TrendingUp, ArrowRight,
    Star, ShieldCheck, Mail
} from 'lucide-react';
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

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.gstin && c.gstin.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Layout>
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="relative">
                    <div className="absolute -left-4 top-0 w-1.5 h-full bg-[#d4af37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
                    <h1 className="text-4xl font-extrabold text-[#581c44] tracking-tighter italic uppercase leading-none">
                        Customer <span className="text-[#d4af37]">Intelligence</span>
                    </h1>
                    <p className="text-[#6d4c41]/60 font-bold uppercase text-[10px] tracking-[0.2em] mt-3 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#d4af37]" />
                        Verified Partner Database v4.1
                    </p>
                </div>
                
                <div className="relative group w-full md:w-[450px]">
                    <div className="absolute inset-0 bg-[#581c44]/5 rounded-xl blur-xl group-focus-within:bg-[#581c44]/10 transition-all"></div>
                    <div className="relative flex items-center bg-white border border-[#e5dbcd] rounded-xl shadow-sm group-focus-within:border-[#d4af37] group-focus-within:shadow-lg group-focus-within:shadow-[#d4af37]/10 transition-all overflow-hidden">
                        <Search className="ml-5 text-[#6d4c41]/40 group-focus-within:text-[#581c44] transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Find client by name or GSTIN..." 
                            className="w-full p-5 pl-4 outline-none font-bold text-[#1a0a14] placeholder:text-[#6d4c41]/30 bg-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-32">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-[#fcf8f1] border-t-[#581c44] rounded-full animate-spin"></div>
                        <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#581c44]" size={24} />
                    </div>
                    <p className="text-[#6d4c41]/50 font-black uppercase tracking-[0.3em] text-[10px] mt-8 italic">Decrypting Database...</p>
                </div>
            ) : filteredCustomers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredCustomers.map((customer) => (
                        <div key={customer._id} className="group relative bg-white rounded-[2rem] border border-slate-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
                            {/* Accent Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                            
                            <div className="p-8 relative">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-xl shadow-slate-200">
                                            {customer.name[0]}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center">
                                            <Star size={12} className="text-white fill-current" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-slate-50 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Loyalty Score</span>
                                        <div className="text-3xl font-black text-slate-800 italic uppercase">#{customer.totalBills}</div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter mb-1 truncate">{customer.name}</h3>
                                    {customer.gstin ? (
                                        <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                            <ShieldCheck size={14} /> Registered: {customer.gstin}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                                            Unregistered Entity
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-50 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin size={14} /></div>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed line-clamp-2">{customer.address || 'Address Protected'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                            <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Revenue</div>
                                            <div className="text-sm font-black text-slate-800 tracking-tight">₹{customer.totalSpent.toLocaleString()}</div>
                                        </div>
                                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                            <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Active Since</div>
                                            <div className="text-sm font-black text-slate-800 tracking-tight">{new Date(customer.lastBillDate).getFullYear()}</div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate(`/bills?search=${encodeURIComponent(customer.name)}`)}
                                    className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all group/btn"
                                >
                                    Billing History <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                        <Users size={48} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-300 uppercase italic">No Partners Found</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Create your first invoice to build your network.</p>
                </div>
            )}
        </Layout>
    );
};

export default Customers;
