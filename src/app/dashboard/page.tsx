"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/StatCard';
import RevenueChart from '@/components/RevenueChart';
import ProjectList from '@/components/ProjectList';
import { DollarSign, Users, Briefcase, CheckCircle, Clock, FileText } from 'lucide-react';
import styles from './page.module.css';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetch(`/api/analytics?role=${user.role}&userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setStats(data.stats);
                    setChartData(data.chartData);
                });
        }
    }, [user]);

    if (!user || !stats) return <div className="p-8">Loading Dashboard...</div>;

    return (
        <div>
            <div className={styles.grid}>
                {/* Admin Stats */}
                {user.role === 'admin' && (
                    <>
                        <StatCard
                            title="Total Revenue"
                            value={`$${stats.totalRevenue.toLocaleString()}`}
                            trend={{ value: 12, isPositive: true }}
                            icon={<DollarSign />}
                            color="#3b82f6"
                        />
                        <StatCard
                            title="Total Clients"
                            value={stats.totalClients}
                            trend={{ value: 4, isPositive: true }}
                            icon={<Users />}
                            color="#6366f1"
                        />
                        <StatCard
                            title="Active Projects"
                            value={stats.activeProjects}
                            icon={<Briefcase />}
                            color="#f59e0b"
                        />
                        <StatCard
                            title="Pending Tasks"
                            value={stats.pendingTasks}
                            trend={{ value: 2, isPositive: false }}
                            icon={<Clock />}
                            color="#ec4899"
                        />
                    </>
                )}

                {/* Staff Stats */}
                {user.role === 'staff' && (
                    <>
                        <StatCard
                            title="My Active Projects"
                            value={stats.staffStats?.myActiveProjects || 0}
                            icon={<Briefcase />}
                            color="#3b82f6"
                        />
                        <StatCard
                            title="Tasks Due Soon"
                            value={stats.staffStats?.myDueTasks || 0}
                            trend={{ value: 1, isPositive: false }}
                            icon={<Clock />}
                            color="#f59e0b"
                        />
                        <StatCard
                            title="Completed Tasks"
                            value={stats.staffStats?.myCompletedTasks || 0}
                            trend={{ value: 8, isPositive: true }}
                            icon={<CheckCircle />}
                            color="#10b981"
                        />
                    </>
                )}

                {/* Client Stats - Keeping static structure for now or reuse Admin stats where appropriate */}
                {user.role === 'client' && (
                    <>
                        <StatCard
                            title="Total Invoiced"
                            value="$5,400"
                            icon={<FileText />}
                            color="#6366f1"
                        />
                        <StatCard
                            title="Active Project Status"
                            value="In Progress"
                            icon={<Briefcase />}
                            color="#3b82f6"
                        />
                        <StatCard
                            title="Pending Requests"
                            value="1"
                            icon={<Clock />}
                            color="#f59e0b"
                        />
                    </>
                )}
            </div>

            <div className={styles.section}>
                <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <RevenueChart data={chartData} />
                </div>
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <ProjectList />
                </div>
            </div>
        </div>
    );
}
