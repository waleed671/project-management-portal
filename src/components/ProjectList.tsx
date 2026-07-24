"use client";

import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './ProjectList.module.css';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Modal from './ui/Modal';



export default function ProjectList() {
    const [projects, setProjects] = useState<any[]>([]);
    const { user } = useAuth();

    const [staff, setStaff] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetch(`/api/projects?role=${user.role}&userId=${user.id}`)
                .then(res => res.json())
                .then(data => setProjects(data));

            if (user.role === 'admin') {
                fetch('/api/users').then(res => res.json()).then(data => {
                    setStaff(data.filter((u: any) => u.role === 'staff'));
                });
            }
        }
    }, [user]);

    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    const toggleMenu = (id: number) => {
        if (activeMenu === id) {
            setActiveMenu(null);
        } else {
            setActiveMenu(id);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // prevent closing menu immediately (though we want it closed after)
        if (!confirm('Are you sure you want to delete this project?')) return;

        const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setProjects(projects.filter(p => p.id !== id));
        } else {
            alert('Failed to delete project');
        }
    };

    const handleEdit = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const project = projects.find(p => p.id === id);
        if (project) {
            setEditForm({
                id: project.id,
                title: project.title,
                clientName: project.clientName,
                status: project.status,
                deadline: project.deadline,
                userId: project.userId || ''
            });
            setIsEditModalOpen(true);
        }
        setActiveMenu(null);
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<any>({ id: 0, title: '', clientName: '', status: '', deadline: '', userId: '' });

    const saveEdit = async () => {
        const res = await fetch('/api/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        });

        if (res.ok) {
            alert('Project updated');
            setIsEditModalOpen(false);
            // Updating local state to reflect changes immediately
            setProjects(projects.map(p => p.id === editForm.id ? { ...p, ...editForm } : p));
        } else {
            alert('Update failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Recent Projects</h3>
                <Link href="/dashboard/projects" className={styles.viewAll}>View All</Link>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Client</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td><span className={styles.projectName}>{project.title}</span></td>
                            <td>{project.clientName}</td>
                            <td>
                                <span className={clsx(styles.status, styles[project.status.toLowerCase().replace(' ', '')])}>
                                    {project.status}
                                </span>
                            </td>
                            <td>{project.deadline}</td>
                            <td className={styles.actionCell}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(project.id);
                                    }}
                                    title="Actions"
                                >
                                    <MoreHorizontal size={18} />
                                </button>
                                {activeMenu === project.id && (
                                    <div className={styles.dropdown}>
                                        <button className={styles.dropdownItem} onClick={(e) => handleEdit(e, project.id)}>Edit</button>
                                        <button className={clsx(styles.dropdownItem, styles.deleteItem)} onClick={(e) => handleDelete(e, project.id)}>Delete</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Project Title</label>
                        <input
                            style={{ width: '100%', padding: '8px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-main)' }}
                            type="text"
                            value={editForm.title}
                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Client Name</label>
                        <input
                            style={{ width: '100%', padding: '8px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-main)' }}
                            type="text"
                            value={editForm.clientName}
                            onChange={e => setEditForm({ ...editForm, clientName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Status</label>
                        <select
                            style={{ width: '100%', padding: '8px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-main)' }}
                            value={editForm.status}
                            onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Deadline</label>
                        <input
                            style={{ width: '100%', padding: '8px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-main)' }}
                            type="date"
                            value={editForm.deadline}
                            onChange={e => setEditForm({ ...editForm, deadline: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>Assigned Staff</label>
                        <select
                            style={{ width: '100%', padding: '8px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-main)' }}
                            value={editForm.userId}
                            onChange={e => setEditForm({ ...editForm, userId: e.target.value })}
                        >
                            <option value="">-- Unassigned --</option>
                            {staff.map(s => (
                                <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                            ))}
                        </select>
                    </div>
                    <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
                </div>
            </Modal>
        </div>
    );
}
