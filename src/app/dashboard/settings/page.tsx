"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './settings.module.css';
import { User, Bell, Moon, Shield, Save } from 'lucide-react';
import clsx from 'clsx';

export default function SettingsPage() {
    const { user: initialUser } = useAuth(); // renamed to avoid confusion with local state if needed
    const { theme, toggleTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(false);

    // Local state for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        emailAlerts: true,
        projectUpdates: true
    });

    // Fetch latest settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem('portal_token');
            if (!token) return;

            try {
                const res = await fetch('/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        emailAlerts: data.emailAlerts ?? true,
                        projectUpdates: data.projectUpdates ?? true
                    });
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('portal_token');

        try {
            const res = await fetch('/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    emailAlerts: formData.emailAlerts,
                    projectUpdates: formData.projectUpdates
                })
            });

            if (!res.ok) throw new Error('Failed to update settings');

            alert("Settings saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Error saving settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Settings</h1>
                <p>Manage your preferences and account details</p>
            </header>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <button
                        className={clsx(styles.tabBtn, activeTab === 'account' && styles.active)}
                        onClick={() => setActiveTab('account')}
                    >
                        <User size={18} /> Account
                    </button>
                    <button
                        className={clsx(styles.tabBtn, activeTab === 'notifications' && styles.active)}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button
                        className={clsx(styles.tabBtn, activeTab === 'appearance' && styles.active)}
                        onClick={() => setActiveTab('appearance')}
                    >
                        <Moon size={18} /> Appearance
                    </button>
                    {/* Security tab placeholder - could be added later */}
                </aside>

                <main className={styles.content}>
                    {activeTab === 'account' && (
                        <div className="animate-fade-in">
                            <h2>Account Information</h2>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email Address</label>
                                <input type="email" value={formData.email} className={styles.input} disabled />
                                <span className={styles.hint}>Contact admin to change email</span>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <input type="text" value={formData.role} className={styles.input} disabled style={{ textTransform: 'capitalize' }} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="animate-fade-in">
                            <h2>Notifications</h2>
                            <div className={styles.toggleRow}>
                                <div>
                                    <h3>Email Alerts</h3>
                                    <p>Receive daily summaries of your activity</p>
                                </div>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={formData.emailAlerts}
                                        onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                            <div className={styles.toggleRow}>
                                <div>
                                    <h3>Project Updates</h3>
                                    <p>Get notified when a project status changes</p>
                                </div>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={formData.projectUpdates}
                                        onChange={(e) => setFormData({ ...formData, projectUpdates: e.target.checked })}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="animate-fade-in">
                            <h2>Appearance</h2>
                            <div className={styles.themeGrid}>
                                <div
                                    className={clsx(styles.themeCard, theme === 'dark' && styles.themeActive)}
                                    onClick={() => toggleTheme('dark')}
                                >
                                    <div className={styles.themePreview} style={{ background: '#0f1115' }}></div>
                                    <span>Dark (Default)</span>
                                </div>
                                <div
                                    className={clsx(styles.themeCard, theme === 'light' && styles.themeActive)}
                                    onClick={() => toggleTheme('light')}
                                >
                                    <div className={styles.themePreview} style={{ background: '#ffffff', border: '1px solid #ddd' }}></div>
                                    <span>Light</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button className="btn-primary" onClick={handleSave} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
