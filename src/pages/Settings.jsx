import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
    User, Lock, ShieldCheck, Mail, Save, 
    RefreshCw, Key, AlertCircle, CheckCircle2 
} from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const Settings = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUser) {
            setUser({ name: storedUser.name, email: storedUser.email });
        }
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', { name: user.name, email: user.email });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Profile updated successfully!');
            // Refresh layout state if needed (usually handled by reloading or state management)
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            return toast.error('New passwords do not match');
        }
        setLoading(true);
        try {
            await api.put('/auth/profile', { password: passwordData.new });
            setPasswordData({ current: '', new: '', confirm: '' });
            toast.success('Password changed successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
             <div className="mb-8 md:mb-10 pb-4 md:pb-6 border-b border-[#e5dbcd]">
                <h1 className="text-2xl md:text-4xl font-extrabold text-[#581c44] tracking-tighter italic uppercase">Admin Controls</h1>
                <p className="text-[#6d4c41]/60 font-medium uppercase text-[9px] md:text-[10px] tracking-[0.2em] mt-2 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#d4af37]" /> Security and Account Preferences
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Profile Settings */}
                <div className="glass-card bg-white p-8 relative overflow-hidden group shadow-sm">
                    <div className="flex items-center gap-3 mb-8 border-b border-[#fcf8f1] pb-4">
                        <div className="p-3 bg-[#581c44] text-white rounded-lg shadow-sm">
                            <User size={20} />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#581c44] italic uppercase tracking-tighter">System Profile</h3>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#581c44] ml-1">Administrator Name</label>
                            <div className="flex gap-3">
                                <div className="p-4 bg-[#fcf8f1] border border-[#e5dbcd] rounded-lg text-[#d4af37] flex items-center justify-center shrink-0">
                                    <User size={18} />
                                </div>
                                <input 
                                    type="text" 
                                    className="input-field focus:border-[#581c44] bg-white border-[#e5dbcd] font-bold" 
                                    value={user.name} 
                                    onChange={(e) => setUser({...user, name: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#581c44] ml-1">Official ID / Email</label>
                            <div className="flex gap-3">
                                <div className="p-4 bg-[#fcf8f1] border border-[#e5dbcd] rounded-lg text-[#d4af37] flex items-center justify-center shrink-0">
                                    <Mail size={18} />
                                </div>
                                <input 
                                    type="email" 
                                    className="input-field focus:border-[#581c44] bg-white border-[#e5dbcd] font-bold" 
                                    value={user.email} 
                                    onChange={(e) => setUser({...user, email: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="btn btn-primary w-full py-4 text-center justify-center shadow-lg"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                            Sync Profile Records
                        </button>
                    </form>
                </div>

                {/* Password Settings */}
                <div className="glass-card bg-white p-8 relative overflow-hidden shadow-sm border-t-4 border-t-[#d4af37]">
                    <div className="flex items-center gap-3 mb-8 border-b border-[#fcf8f1] pb-4">
                        <div className="p-3 bg-[#d4af37] text-white rounded-lg shadow-sm">
                            <Key size={20} />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#581c44] italic uppercase tracking-tighter">Security Vault</h3>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#581c44] ml-1">New System Password</label>
                            <div className="flex gap-3">
                                <div className="p-4 bg-[#fcf8f1] border border-[#e5dbcd] rounded-lg text-[#d4af37] flex items-center justify-center shrink-0">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="Enter extreme security code"
                                    className="input-field focus:border-[#581c44] bg-white border-[#e5dbcd] font-bold" 
                                    value={passwordData.new} 
                                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#581c44] ml-1">Confirm Protocol</label>
                            <div className="flex gap-3">
                                <div className="p-4 bg-[#fcf8f1] border border-[#e5dbcd] rounded-lg text-[#d4af37] flex items-center justify-center shrink-0">
                                    <ShieldCheck size={18} />
                                </div>
                                <input 
                                    type="password" 
                                    placeholder="Repeat for validation"
                                    className="input-field focus:border-[#581c44] bg-white border-[#e5dbcd] font-bold" 
                                    value={passwordData.confirm} 
                                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full mt-4 bg-[#1a0a14] text-white p-4 rounded-lg shadow-lg hover:bg-[#581c44] transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Lock size={16} />}
                            Update Access Credentials
                        </button>
                    </form>

                    <div className="mt-8 p-4 bg-[#fcf8f1] rounded-lg border border-[#e5dbcd] flex items-start gap-3">
                        <AlertCircle size={18} className="text-[#581c44] shrink-0 mt-0.5" />
                        <p className="text-[9px] text-[#581c44] font-black uppercase tracking-widest leading-relaxed">
                            Passwords are encrypted using military-grade bcrypt hashing. Ensure your new code is complex.
                        </p>
                    </div>
                </div>
            </div>

            {/* Support Footer */}
            <div className="mt-12 glass-card p-10 bg-white border-none shadow-xl text-center">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6d4c41]/30">Prasthan Billing Infrastructure v4.1</p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mt-6">
                    <div className="flex items-center gap-2 text-[#581c44] font-black italic uppercase text-[9px] md:text-[10px]">
                        <CheckCircle2 size={16} className="text-green-500" /> Database Stable
                    </div>
                    <div className="flex items-center gap-2 text-[#581c44] font-black italic uppercase text-[9px] md:text-[10px]">
                        <CheckCircle2 size={16} className="text-green-500" /> SSL Encrypted
                    </div>
                    <div className="flex items-center gap-2 text-[#581c44] font-black italic uppercase text-[9px] md:text-[10px]">
                        <CheckCircle2 size={16} className="text-green-500" /> Audit Log Active
                    </div>
                  </div>
            </div>
        </Layout>
    );
};

export default Settings;
