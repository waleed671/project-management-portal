"use client";

import { useAuth } from '@/context/AuthContext';
import styles from './tasks.module.css';
import { Plus, CheckCircle, Clock, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';



export default function TasksPage() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('Medium');
    const [newTaskStatus, setNewTaskStatus] = useState('To Do');

    useEffect(() => {
        if (user) {
            fetchTasks();
        }
    }, [user]);

    const fetchTasks = () => {
        fetch(`/api/tasks?userId=${user?.id}`)
            .then(res => res.json())
            .then(setTasks);
    };

    const handleCreateTask = async () => {
        await fetch('/api/tasks', {
            method: 'POST',
            body: JSON.stringify({ title: newTaskTitle, priority: newTaskPriority, status: 'To Do', userId: user?.id })
        });
        resetModal();
        fetchTasks();
    };

    const handleUpdateTask = async () => {
        if (!selectedTask) return;
        await fetch('/api/tasks', {
            method: 'PUT',
            body: JSON.stringify({ id: selectedTask.id, title: newTaskTitle, priority: newTaskPriority, status: newTaskStatus })
        });
        resetModal();
        fetchTasks();
    };

    const openCreateModal = () => {
        setSelectedTask(null);
        setNewTaskTitle('');
        setNewTaskPriority('Medium');
        setNewTaskStatus('To Do');
        setIsModalOpen(true);
    };

    const openEditModal = (task: any) => {
        setSelectedTask(task);
        setNewTaskTitle(task.title);
        setNewTaskPriority(task.priority);
        setNewTaskStatus(task.status);
        setIsModalOpen(true);
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
        setNewTaskTitle('');
    };

    if (user?.role !== 'staff') return <div className="glass p-6">Access Denied</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Task Board</h1>
                <button className="btn-primary flex-center" onClick={openCreateModal} style={{ width: 40, height: 40, padding: 0 }}>
                    <Plus size={20} />
                </button>
            </header>

            <div className={styles.board}>
                {['To Do', 'In Progress', 'Done'].map(status => (
                    <div key={status} className={styles.column}>
                        <div className={styles.columnHeader}>
                            <span className={styles.statusDot} data-status={status}></span>
                            <h3>{status}</h3>
                            <span className={styles.count}>{tasks.filter(t => t.status === status).length}</span>
                        </div>

                        <div className={styles.taskList}>
                            {tasks.filter(t => t.status === status).map(task => (
                                <div
                                    key={task.id}
                                    className={styles.taskCard}
                                    onClick={() => openEditModal(task)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h4>{task.title}</h4>
                                    <div className={styles.taskFooter}>
                                        <span className={styles.priority} data-priority={task.priority}>
                                            {task.priority}
                                        </span>
                                        <Clock size={14} className={styles.taskIcon} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div className="glass" style={{ padding: 24, width: 300 }}>
                        <h3>{selectedTask ? 'Edit Task' : 'New Task'}</h3>
                        <input className={styles.input} style={{ marginTop: 12, width: '100%' }} placeholder="Task Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} />

                        <div style={{ marginTop: 12 }}>
                            <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Priority</label>
                            <select
                                className={styles.input}
                                style={{ width: '100%', marginTop: 4 }}
                                value={newTaskPriority}
                                onChange={e => setNewTaskPriority(e.target.value)}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        {selectedTask && (
                            <div style={{ marginTop: 12 }}>
                                <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>Status</label>
                                <select
                                    className={styles.input}
                                    style={{ width: '100%', marginTop: 4 }}
                                    value={newTaskStatus}
                                    onChange={e => setNewTaskStatus(e.target.value)}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="btn-primary" onClick={selectedTask ? handleUpdateTask : handleCreateTask}>
                                {selectedTask ? 'Save' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
