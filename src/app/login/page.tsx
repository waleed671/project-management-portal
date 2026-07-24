"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './login.module.css';

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await login(email, password);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.blob}></div>
            <div className={styles.blob2}></div>

            <div className={styles.glassCard}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <ShieldCheck size={32} color="var(--primary)" />
                        <h1>Nexus<span className="text-highlight">Portal</span></h1>
                    </div>
                    <p className={styles.subtitle}>Welcome back! Please access your account.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail size={18} className={styles.icon} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={18} className={styles.icon} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.eyeBtn}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.actions}>
                        <label className={styles.remember}>
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <Link href="#" className={styles.forgot}>Forgot password?</Link>
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} style={{ marginLeft: 8 }} />
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Don&apos;t have an account? <Link href="/signup">Sign up</Link></p>
                    <div className={styles.chips}>
                        <small>Default: 123456</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
