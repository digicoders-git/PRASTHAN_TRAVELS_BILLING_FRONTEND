import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, Lock, Mail, Save, RefreshCw, Key, AlertCircle } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const Settings = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [passwordData, setPasswordData] = useState({ new: '', confirm: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUser) setUser({ name: storedUser.name, email: storedUser.email });
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', { name: user.name, email: user.email });
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Profile updated successfully!');
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) return toast.error('New passwords do not match');
        setLoading(true);
        try {
            await api.put('/auth/profile', { password: passwordData.new });
            setPasswordData({ new: '', confirm: '' });
            toast.success('Password changed successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div className="bg-white border border-[#dde3f5] rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#dde3f5]">
                        <div className="p-1.5 bg-[#465aa8] rounded-md"><User size={14} className="text-white" /></div>
                        <h3 className="text-sm font-semibold text-[#465aa8]">Profile</h3>
                    </div>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                            <input type="text" className="w-full border border-[#dde3f5] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#465aa8] bg-white text-gray-800 transition-colors"
                                value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                            <input type="email" className="w-full border border-[#dde3f5] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#465aa8] bg-white text-gray-800 transition-colors"
                                value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 text-xs font-medium text-white bg-[#465aa8] hover:bg-[#3a4d96] py-2.5 rounded-md transition-all disabled:opacity-60">
                            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />} Save Profile
                        </button>
                    </form>
                </div>

                <div className="bg-white border border-[#dde3f5] rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#dde3f5]">
                        <div className="p-1.5 bg-[#38b45c] rounded-md"><Key size={14} className="text-white" /></div>
                        <h3 className="text-sm font-semibold text-[#465aa8]">Change Password</h3>
                    </div>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                            <input type="password" placeholder="Enter new password" className="w-full border border-[#dde3f5] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#465aa8] bg-white text-gray-800 transition-colors"
                                value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Confirm Password</label>
                            <input type="password" placeholder="Repeat new password" className="w-full border border-[#dde3f5] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#465aa8] bg-white text-gray-800 transition-colors"
                                value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} required />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 text-xs font-medium text-white bg-[#465aa8] hover:bg-[#3a4d96] py-2.5 rounded-md transition-all disabled:opacity-60">
                            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Lock size={13} />} Update Password
                        </button>
                    </form>
                    <div className="mt-3 flex items-start gap-2 p-3 bg-[#f0f4ff] border border-[#dde3f5] rounded-md">
                        <AlertCircle size={13} className="text-[#465aa8] shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-500">Passwords are encrypted with bcrypt. Use a strong password.</p>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default Settings;
