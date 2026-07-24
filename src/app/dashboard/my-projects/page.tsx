"use client";

import { useAuth } from '@/context/AuthContext';
import styles from './my-projects.module.css';
import Badge from '@/components/ui/Badge';

import Modal from '@/components/ui/Modal';
import { Loader } from 'lucide-react';

import { useState, useEffect } from 'react';

export default function MyProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetch(`/api/projects?role=staff&userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setProjects(data);
                    setLoading(false);
                });
        }
    }, [user]);

    if (user?.role !== 'staff') return <div className="glass p-6">Access Denied</div>;

    const openDetails = (project: any) => {
        setSelectedProject(project);
        setIsDetailsOpen(true);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>My Projects</h1>
                <p>Projects assigned to you</p>
            </header>

            {loading ? (
                <div className="flex-center p-12 text-muted">
                    <Loader className="spin" /> Loading Projects...
                </div>
            ) : projects.length === 0 ? (
                <div className="glass p-8 text-center text-muted">No projects assigned yet.</div>
            ) : (
                <div className={styles.grid}>
                    {projects.map(p => (
                        <div key={p.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>{p.title}</h3>
                                <Badge
                                    label={p.status}
                                    variant={p.status === 'In Progress' ? 'info' : p.status === 'Completed' ? 'success' : 'neutral'}
                                />
                            </div>

                            <p className={styles.client}>{p.clientName}</p>

                            <div className={styles.meta}>
                                <span>Due: {p.deadline}</span>
                            </div>

                            <div className={styles.progressSection}>
                                <div className={styles.progressLabel}>
                                    <span>Progress</span>
                                    <span>{p.progress || 0}%</span>
                                </div>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${p.progress || 0}%` }}></div>
                                </div>
                            </div>

                            <button
                                className="btn-primary"
                                style={{ width: '100%', marginTop: '20px', fontSize: '13px' }}
                                onClick={() => openDetails(p)}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                title="Project Details"
            >
                {selectedProject && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Project Title</label>
                            <div style={{ fontSize: 16, fontWeight: 600 }}>{selectedProject.title}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Client</label>
                                <div>{selectedProject.clientName}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Status</label>
                                <div><Badge label={selectedProject.status} variant="neutral" /></div>
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Deadline</label>
                            <div>{selectedProject.deadline}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Progress ({selectedProject.progress || 0}%)</label>
                            <div className={styles.progressBar} style={{ marginTop: 6, height: 8 }}>
                                <div className={styles.progressFill} style={{ width: `${selectedProject.progress || 0}%` }}></div>
                            </div>
                        </div>
                        <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                assigned to Staff ID: #{user.id}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
