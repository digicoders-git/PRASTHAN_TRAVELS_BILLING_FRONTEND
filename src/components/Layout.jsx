import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileCheck,
    FileSpreadsheet,
    Library,
    Users,
    BarChart3,
    Settings,
    LogOut, 
    Menu, 
    X
} from 'lucide-react';
import { toast } from 'react-toastify';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    const handleLogout = () => {
        logout();
        toast.info('Logged out');
        navigate('/login');
    };

    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'GST Bill', path: '/add-gst-bill', icon: FileCheck },
        { name: 'Non GST Bill', path: '/add-nongst-bill', icon: FileSpreadsheet },
        { name: 'All Bills', path: '/bills', icon: Library },
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-[#f4f6fb] overflow-hidden text-[#1e2a4a]">

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 bg-white w-60 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition-all duration-300 z-50 flex flex-col border-r border-[#dde3f5]`}>
                
                {/* Logo Header */}
                <div className="flex items-center gap-3 px-4 border-b border-[#dde3f5] h-16 shrink-0">
                    <img src="/assets/logo.png" alt="Prasthan" className="w-11 h-11 object-contain" />
                    <div>
                        <p className="text-sm font-semibold text-[#465aa8] leading-tight">Prasthan Travels</p>
                        <p className="text-xs text-gray-400">Billing System</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {links.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                                isActive(link.path)
                                    ? 'bg-[#465aa8] text-white'
                                    : 'text-gray-500 hover:bg-[#f0f4ff] hover:text-[#465aa8]'
                            }`}
                        >
                            <link.icon size={16} />
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* User + Logout */}
                <div className="px-3 py-3 border-t border-[#dde3f5]">
                    <div className="flex items-center gap-2 px-2 py-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-[#465aa8] text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                    >
                        <LogOut size={15} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top Header */}
                <header className="bg-white border-b border-[#dde3f5] flex items-center justify-between px-5 h-16 shrink-0">
                    {/* Left: hamburger (mobile) + page name (desktop) */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-50 rounded-md">
                            <Menu size={18} />
                        </button>
                        <span className="text-sm font-semibold text-[#465aa8] hidden lg:block">
                            {links.find(l => l.path === location.pathname)?.name || 'Dashboard'}
                        </span>
                        <img src="/assets/logo.png" alt="Logo" className="lg:hidden h-9 w-auto object-contain" />
                    </div>

                    {/* Right: date/time + admin info */}
                    <div className="flex items-center gap-4">
                        {/* Live Date & Time */}
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-medium text-[#465aa8]">{formatTime(now)}</span>
                            <span className="text-[11px] text-gray-400">{formatDate(now)}</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-8 bg-[#dde3f5]" />

                        {/* Admin Avatar + Name */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#465aa8] text-white flex items-center justify-center text-sm font-bold shrink-0">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-xs font-semibold text-gray-800 leading-tight">{user?.name || 'Admin'}</p>
                                <p className="text-[10px] text-gray-400">Administrator</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#f4f6fb]">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
