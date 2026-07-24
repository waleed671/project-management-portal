"use client";

import { useAuth, UserRole } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Settings,
    Briefcase,
    FileText,
    BarChart,
    LogOut,
    Shield,
    Layers
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from './Sidebar.module.css';

interface NavItem {
    icon: any;
    label: string;
    href: string;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['admin', 'staff', 'client'] },
    { icon: Users, label: 'Staff & Clients', href: '/dashboard/users', roles: ['admin'] },
    { icon: Briefcase, label: 'All Projects', href: '/dashboard/projects', roles: ['admin'] },
    { icon: Briefcase, label: 'My Projects', href: '/dashboard/my-projects', roles: ['staff'] },
    { icon: Layers, label: 'Tasks', href: '/dashboard/tasks', roles: ['staff'] },
    { icon: BarChart, label: 'Progress', href: '/dashboard/progress', roles: ['client'] },
    { icon: FileText, label: 'Invoices', href: '/dashboard/invoices', roles: ['client', 'admin'] },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', roles: ['admin', 'staff', 'client'] },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const filteredNav = navItems.filter(item => item.roles.includes(user.role));

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <Shield size={28} color="var(--primary)" />
                <h2>Nexus<span className={styles.highlight}>Admin</span></h2>
            </div>

            <div className={styles.userProfile}>
                <div className={styles.avatar}>
                    {user.name.charAt(0)}
                </div>
                <div className={styles.userInfo}>
                    <p className={styles.userName}>{user.name}</p>
                    <span className={styles.userRole}>{user.role}</span>
                </div>
            </div>

            <nav className={styles.nav}>
                <div className={styles.navLabel}>MENU</div>
                {filteredNav.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(styles.navItem, pathname === item.href && styles.active)}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.footer}>
                <button onClick={logout} className={styles.logoutBtn}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
