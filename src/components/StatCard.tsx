"use client";

import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './StatCard.module.css';

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon: ReactNode;
    color?: string; // Hex for glow
}

export default function StatCard({ title, value, trend, icon, color = "#3b82f6" }: StatCardProps) {
    return (
        <div className={styles.card} style={{ '--card-glow': color } as any}>
            <div className={styles.header}>
                <span className={styles.iconWrapper} style={{ backgroundColor: `${color}20`, color: color }}>
                    {icon}
                </span>
                {trend && (
                    <span className={clsx(styles.trend, trend.isPositive ? styles.positive : styles.negative)}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>
            <div className={styles.content}>
                <h3 className={styles.value}>{value}</h3>
                <p className={styles.title}>{title}</p>
            </div>
        </div>
    );
}
