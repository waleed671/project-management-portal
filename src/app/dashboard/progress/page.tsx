"use client";

import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import styles from './progress.module.css';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import clsx from 'clsx';

const TIMELINE = [
    { id: 1, title: 'Project Initiation', date: 'Oct 15, 2023', status: 'completed', desc: 'Requirements gathering and initial deposit.' },
    { id: 2, title: 'Design Phase', date: 'Nov 01, 2023', status: 'completed', desc: 'Wireframes and high-fidelity mockups approved.' },
    { id: 3, title: 'Development', date: 'In Progress', status: 'current', desc: 'Frontend implementation and backend integration.' },
    { id: 4, title: 'Testing & QA', date: 'Pending', status: 'upcoming', desc: 'Bug fixing and user acceptance testing.' },
    { id: 5, title: 'Launch', date: 'Pending', status: 'upcoming', desc: 'Deployment to production server.' },
];

export default function ProgressPage() {
    const { user } = useAuth();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetch('/api/projects') // Fetch all projects, then filter. Ideally API should filter.
                .then(res => res.json())
                .then(data => {
                    // Find the project for this client
                    // Matching by exact name is fragile but fits current schema
                    const myProject = data.find((p: any) => p.clientName.toLowerCase() === user.name.toLowerCase());
                    setProject(myProject || null);
                    setLoading(false);
                });
        }
    }, [user]);

    if (user?.role !== 'client') return <div className="glass p-6">Access Denied</div>;
    if (loading) return <div className="glass p-6">Loading Project Status...</div>;

    if (!project) {
        return (
            <div className={styles.container}>
                <div className="glass p-8 text-center">
                    <h2>No Active Projects</h2>
                    <p className="text-muted">You don't have any projects in progress yet. Please contact support.</p>
                </div>
            </div>
        );
    }

    // Dynamic Timeline generator
    const getTimeline = (status: string, deadline: string) => {
        const isCompleted = status === 'Completed';
        const inProgress = status === 'In Progress';

        // Base timeline
        const steps = [
            { id: 1, title: 'Project Initiation', status: 'completed', desc: 'Requirements have been gathered.' },
            { id: 2, title: 'Design & Planning', status: isCompleted || inProgress ? 'completed' : 'current', desc: 'Mockups and Project Plan.' },
            { id: 3, title: 'Development', status: isCompleted ? 'completed' : inProgress ? 'current' : 'upcoming', desc: 'Core Implementation.' },
            { id: 4, title: 'Review & QA', status: isCompleted ? 'completed' : 'upcoming', desc: 'Final testing and adjustments.' },
            { id: 5, title: 'Launch', date: deadline, status: isCompleted ? 'completed' : 'upcoming', desc: 'Project delivery.' },
        ];
        return steps;
    };

    const timeline = getTimeline(project.status, project.deadline);
    const progress = project.status === 'Completed' ? 100 : project.status === 'In Progress' ? (project.progress || 50) : 10;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Project Progress</h1>
                <p>Tracking: <strong>{project.title}</strong></p>
            </header>

            <div className={styles.content}>
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <h3>Total Progress</h3>
                        <div className={styles.bigNumber}>{progress}%</div>
                        <div className={styles.bar}>
                            <div className={styles.fill} style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Current Status</h3>
                        <div className={styles.bigText}>{project.status}</div>
                        <div className={styles.subText}>Deadline: {project.deadline}</div>
                    </div>
                </div>

                <div className={styles.timeline}>
                    {timeline.map((item, index) => (
                        <div key={item.id} className={clsx(styles.step, styles[item.status])}>
                            <div className={styles.icon}>
                                {item.status === 'completed' ? <CheckCircle size={20} /> :
                                    item.status === 'current' ? <Clock size={20} /> :
                                        <Circle size={20} />}
                            </div>
                            <div className={styles.stepContent}>
                                <div className={styles.stepHeader}>
                                    <h4>{item.title}</h4>
                                    {item.date && <span className={styles.stepDate}>{item.date}</span>}
                                </div>
                                <p>{item.desc}</p>
                            </div>
                            {index !== timeline.length - 1 && <div className={styles.line}></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
