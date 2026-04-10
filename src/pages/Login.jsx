import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome to Prasthan Travels!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f6fb]">
            <div className="w-full max-w-sm px-8 py-10 bg-white border border-[#dde3f5] rounded-lg shadow-md">
                
                <div className="text-center mb-8">
                    <img src="/assets/logo.png" alt="Prasthan Travels" className="w-30 h-auto mx-auto mb-4" />
                    {/* <h1 className="text-xl font-bold text-[#581c44]">Prasthan Travels</h1> */}
                    <p className="text-sm text-gray-500 mt-1">Admin Login</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            className="input-field text-sm"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            className="input-field text-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary justify-center mt-2"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={16} /> Signing in...</>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

               
            </div>
        </div>
    );
};

export default Login;
