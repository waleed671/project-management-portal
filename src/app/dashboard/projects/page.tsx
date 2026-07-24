"use client";

import { useAuth } from '@/context/AuthContext';
import styles from './projects.module.css';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import ProjectList from '@/components/ProjectList';

export default function ProjectsPage() {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ title: '', clientName: '', deadline: '', status: 'Pending', userId: '' });
    const [staff, setStaff] = useState<any[]>([]);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetch('/api/users').then(res => res.json()).then(data => {
                setStaff(data.filter((u: any) => u.role === 'staff'));
            });
        }
    }, [user]);

    const handleCreate = async () => {
        await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form })
        });
        alert('Project Created!');
        setIsModalOpen(false);
        // In a real app we'd trigger a refetch in ProjectList or hoist state
        window.location.reload();
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>All Projects</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>New Project</button>
            </header>

            <div className="glass" style={{ padding: '24px', borderRadius: '12px' }}>
                <ProjectList />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label className={styles.label}>Project Title</label>
                        <input className={styles.input} type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div>
                        <label className={styles.label}>Client Name</label>
                        <input className={styles.input} type="text" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} />
                    </div>
                    <div>
                        <label className={styles.label}>Deadline</label>
                        <input className={styles.input} type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                    </div>
                    <div>
                        <label className={styles.label}>Assign Staff</label>
                        <select
                            className={styles.input}
                            value={form.userId}
                            onChange={e => setForm({ ...form, userId: e.target.value })}
                        >
                            <option value="">-- Unassigned --</option>
                            {staff.map(s => (
                                <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-primary" onClick={handleCreate}>Create Project</button>
                </div>
            </Modal>
        </div>
    );
}
