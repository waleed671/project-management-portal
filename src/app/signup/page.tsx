"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import styles from './signup.module.css';

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Optional: Success feedback before redirect
            const btn = document.getElementById('submitBtn');
            if (btn) btn.innerText = 'Success!';

            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);

        } catch (err: any) {
            alert(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Visual Side (Left) */}
            <div className={styles.visualSide}>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>

                <div className={styles.visualContent}>
                    <h1>Start your <br />journey with us.</h1>
                    <p>
                        Join thousands of users managing their projects and workflows efficiently.
                        Experience the next generation of portal management.
                    </p>
                </div>
            </div>

            {/* Form Side (Right) */}
            <div className={styles.formSide}>
                <div className={styles.formCard}>
                    <div className={styles.header}>
                        <h2>Create Account</h2>
                        <p>Sign up to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <User size={20} className={styles.inputIcon} />
                                <input
                                    className={styles.input}
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={20} className={styles.inputIcon} />
                                <input
                                    className={styles.input}
                                    type="email"
                                    placeholder="you@company.com"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={20} className={styles.inputIcon} />
                                <input
                                    className={styles.input}
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Role</label>
                            <div className={styles.inputWrapper}>
                                <Briefcase size={20} className={styles.inputIcon} />
                                <select
                                    className={`${styles.input} ${styles.select}`}
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="client">Client</option>
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <button
                            id="submitBtn"
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        Already have an account?
                        <Link href="/login">Login here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
