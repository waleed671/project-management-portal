import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps {
    label: string;
    variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info';
}

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
    return (
        <span className={clsx(styles.badge, styles[variant])}>
            {label}
        </span>
    );
}
