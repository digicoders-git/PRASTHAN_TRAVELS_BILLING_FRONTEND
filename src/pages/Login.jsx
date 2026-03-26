import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Login Successful! Welcome to Prasthan Travels.');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Check details.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden relative">
            {/* Background Decorative */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-800 blur-[120px] rounded-full"></div>
            </div>

            <div className="glass-card w-full max-w-[450px] p-10 bg-slate-950 border border-slate-800 relative z-10 shadow-2xl">
                <div className="text-center mb-10">
                    <img src="/assets/logo.png" alt="Prasthan Travels" className="w-32 h-auto mx-auto mb-6 drop-shadow-2xl" />
                    <h1 className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">Internal Login</h1>
                    <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full"></div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} className="text-blue-500" /> Admin Credentials
                        </label>
                        <input 
                            type="email" 
                            className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all font-semibold"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Lock size={14} className="text-blue-500" /> Password Key
                        </label>
                        <input 
                            type="password" 
                            className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all font-semibold"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full btn bg-blue-600 text-white p-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all mt-4">
                        <LogIn size={20} /> Authorize Access
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-800 text-center">
                    <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Prasthan Travels ERP System v4.1.0-Classic</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
