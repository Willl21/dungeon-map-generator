import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Wand2,
    MapPin,
    Trophy,
    Settings,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavItem {
    label: string;
    icon: React.ReactNode;
    href: string;
}

const navItems: NavItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard" },
    { label: "Generate", icon: <Wand2 className="h-5 w-5" />, href: "/generate" },
    { label: "My Maps", icon: <MapPin className="h-5 w-5" />, href: "/my-maps" },
    { label: "Achievements", icon: <Trophy className="h-5 w-5" />, href: "/achievements" },
    { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/settings" },
];

export default function DashboardSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900 border-r border-gold-900/30 overflow-y-auto hidden md:flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gold-900/30">
                <Link to="/" className="group flex items-center gap-2">
                    <div className="text-2xl font-serif font-bold">
                        <span className="text-gold-400">◆</span>
                        <span className="text-gradient ml-2">DG</span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? "bg-gradient-to-r from-gold-600/30 to-gold-600/10 border-l-2 border-gold-400 text-gold-300"
                                    : "text-foreground/70 hover:text-gold-400 hover:bg-gold-900/10"
                                }`}
                        >
                            {/* Background glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/10 to-gold-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Icon */}
                            <span className="relative z-10 flex-shrink-0">{item.icon}</span>

                            {/* Label */}
                            <span className="relative z-10 font-medium text-sm flex-1">{item.label}</span>

                            {/* Active indicator */}
                            {isActive && (
                                <ChevronRight className="h-4 w-4 text-gold-400 relative z-10" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="p-6 border-t border-gold-900/30">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:text-red-400 hover:bg-red-950/30 transition-all duration-300 group"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gold-600/5 to-transparent pointer-events-none" />
        </aside>
    );
}
