"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { MoreVertical, UserPlus, Mail, Shield } from 'lucide-react';
import styles from './users.module.css';
import clsx from 'clsx';



export default function UsersPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New User State
    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'staff' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch('/api/users').then(res => res.json()).then(setUsers);
    };

    const [activeMenu, setActiveMenu] = useState<number | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setActiveMenu(activeMenu === id ? null : id);
    };

    const handleSaveUser = async () => {
        const method = selectedUser ? 'PUT' : 'POST';
        const body = selectedUser
            ? { id: selectedUser.id, name: newUserForm.name, email: newUserForm.email, role: newUserForm.role }
            : newUserForm;

        const res = await fetch('/api/users', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert(selectedUser ? 'User updated!' : 'User created!');
            setIsModalOpen(false);
            fetchUsers();
            resetForm();
        } else {
            alert('Operation failed');
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this user?')) return;

        const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchUsers();
        } else {
            alert('Failed to delete user');
        }
    };

    const handleEdit = (e: React.MouseEvent, u: any) => {
        e.stopPropagation();
        setSelectedUser(u);
        setNewUserForm({ name: u.name, email: u.email, password: '', role: u.role });
        setIsModalOpen(true);
        setActiveMenu(null);
    };

    const resetForm = () => {
        setNewUserForm({ name: '', email: '', password: '', role: 'staff' });
        setSelectedUser(null);
    };

    if (user?.role !== 'admin') {
        return <div className="glass p-6">Access Denied</div>;
    }

    const handleOpenModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>User Management</h1>
                    <p>Manage access and accounts</p>
                </div>
                <button className="btn-primary flex-center" style={{ gap: 8 }} onClick={handleOpenModal}>
                    <UserPlus size={18} /> Add User
                </button>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>#{u.id}</span></td>
                                <td><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>#{u.id}</span></td>
                                <td>
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>{u.name.charAt(0)}</div>
                                        <span>{u.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: 6 }}>
                                        {u.role === 'admin' ? <Shield size={14} /> : <Mail size={14} />}
                                        <span style={{ textTransform: 'capitalize' }}>{u.role}</span>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <Badge label="Active" variant="success" />
                                </td>
                                <td style={{ position: 'relative' }}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={(e) => toggleMenu(e, u.id)}
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {activeMenu === u.id && (
                                        <div className={styles.dropdown}>
                                            <button className={styles.dropdownItem} onClick={(e) => handleEdit(e, u)}>Edit</button>
                                            <button className={clsx(styles.dropdownItem, styles.deleteItem)} onClick={(e) => handleDelete(e, u.id)}>Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? "Edit User" : "Add New User"}
            >
                <div className={styles.modalContent}>
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={newUserForm.name}
                            onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={newUserForm.email}
                            onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        />
                    </div>

                    {!selectedUser && (
                        <div className={styles.formGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                className={styles.input}
                                value={newUserForm.password}
                                onChange={e => setNewUserForm({ ...newUserForm, password: e.target.value })}
                            />
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label>Role</label>
                        <select
                            className={styles.select}
                            value={newUserForm.role}
                            onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                        >
                            <option value="staff">Staff</option>
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className={styles.modalActions}>
                        <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleSaveUser}>
                            {selectedUser ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
