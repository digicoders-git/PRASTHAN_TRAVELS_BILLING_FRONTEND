import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    PlusCircle, 
    LogOut, 
    Menu, 
    X, 
    User, 
    ChevronRight,
    Users,
    BarChart3,
    Settings,
    FileCheck,
    FileSpreadsheet,
    Library
} from 'lucide-react';
import { toast } from 'react-toastify';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.info('Logged out safely');
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
        <div className="flex h-screen bg-[#fcfbf9] transition-colors duration-500 overflow-hidden text-[#1a0a14]">
            {/* Sidebar Desktop (White & Classic) */}
            {/* Sidebar Desktop (White & Classic) */}
            <aside className={`fixed inset-y-0 left-0 bg-white w-72 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-slate-200`}>
                <div className="p-6 flex flex-col items-center relative">
                    {/* Close button for mobile sidebar */}
                    <button 
                        onClick={() => setSidebarOpen(false)} 
                        className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    
                    <img src="/assets/logo.png" alt="PRASTHAN" className="w-24 h-auto object-contain mb-3" />
                    <div className="h-px w-8 bg-[#d4af37] mb-1"></div>
                </div>

                <nav className="flex-1 px-4 mt-5 space-y-2 overflow-y-auto">
                    {links.map((link) => (
                        <Link 
                            key={link.name} 
                            to={link.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-5 py-4 rounded-lg transition-all duration-200 group ${isActive(link.path) ? 'bg-[#581c44] text-[#d4af37] shadow-xl shadow-[#581c44]/20' : 'text-[#6d4c41]/70 hover:text-[#581c44] hover:bg-[#fcf8f1]'}`}
                        >
                            <link.icon size={18} className={`${isActive(link.path) ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="font-extrabold tracking-widest uppercase text-[10px]">{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/20">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#fcf8f1] border border-[#d4af37]/30 flex items-center justify-center text-[#581c44] font-black text-lg shadow-sm shrink-0">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-black text-slate-800 truncate leading-none uppercase italic">{user?.name}</p>
                            <p className="text-[9px] text-slate-400 truncate uppercase font-bold tracking-widest mt-1.5">{user?.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-4 py-2 text-[#6d4c41]/50 hover:text-[#8b0000] hover:bg-[#fdf2f2] rounded-lg transition-all font-bold tracking-wide group"
                    >
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-[11px] uppercase">Sign Out System</span>
                    </button>
                    <p className="text-[7px] text-[#6d4c41]/30 text-center mt-2 font-black tracking-widest uppercase italic">Prasthan ERP v4.1</p>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header Mobile */}
                <header className="lg:hidden h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40 transition-all shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="p-3 text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors">
                        <Menu size={24} />
                    </button>
                    <img src="/assets/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
                    <div className="w-10"></div>
                </header>

                {/* Mobile Backdrop */}
                {sidebarOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" onClick={() => setSidebarOpen(false)}></div>
                )}

                {/* Scrollable Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 lg:p-14 scroll-smooth bg-[#fcfbf9]">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
