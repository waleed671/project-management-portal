"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './RevenueChart.module.css';

// Mocks removed - data passed via props
interface RevenueChartProps {
    data: { name: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    // Use prop data directly
    const chartData = data && data.length > 0 ? data : [];

    useEffect(() => {
        setIsMounted(true);
    }, []);


    if (!isMounted) return <div className={styles.chartContainer} style={{ height: '380px' }} />;

    return (
        <div className={styles.chartContainer}>
            <div className={styles.header}>
                <h3>Revenue Overview</h3>
                <span className={styles.subtitle}>Last 6 Months</span>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="name" stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--text-main)' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
