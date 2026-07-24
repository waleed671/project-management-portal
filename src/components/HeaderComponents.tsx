"use client";

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, X, ChevronRight, File, User, CreditCard } from 'lucide-react';
import styles from './HeaderComponents.module.css';
import clsx from 'clsx';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';

const NOTIFICATIONS = [
    { id: 1, text: 'New Invoice #304 received', time: '2m ago', read: false },
    { id: 2, text: 'Project "Mobile App" updated', time: '1h ago', read: false },
    { id: 3, text: 'Welcome to Nexus Portal', time: '1d ago', read: true },
];



export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [readCount, setReadCount] = useState(2);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setReadCount(0); // Mark all as read on open mock
    };

    return (
        <div className={styles.wrapper} ref={dropdownRef}>
            <button className={styles.iconBtn} onClick={handleOpen}>
                <Bell size={20} />
                {readCount > 0 && <span className={styles.badge}>{readCount}</span>}
            </button>

            {isOpen && (
                <div className={clsx(styles.dropdown, "animate-fade-in")}>
                    <div className={styles.dropdownHeader}>
                        <h3>Notifications</h3>
                        <span>Mark all read</span>
                    </div>
                    <div className={styles.list}>
                        {NOTIFICATIONS.map(n => (
                            <div key={n.id} className={clsx(styles.item, !n.read && styles.unread)}>
                                <p className={styles.itemText}>{n.text}</p>
                                <span className={styles.itemTime}>{n.time}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.dropdownFooter}>
                        View All Activity
                    </div>
                </div>
            )}
        </div>
    );
}

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length > 1) {
            const timer = setTimeout(() => {
                fetch(`/api/search?q=${query}`)
                    .then(res => res.json())
                    .then(data => setResults(data));
            }, 300); // 300ms debounce
            return () => clearTimeout(timer);
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className={styles.searchContainer} ref={containerRef}>
            <div className={clsx(styles.searchBox, isFocused && styles.searchActive)}>
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Search projects, users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                />
                {query && (
                    <button onClick={() => setQuery('')} className={styles.clearBtn}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {isFocused && query.length > 0 && (
                <div className={clsx(styles.resultsDropdown, "animate-fade-in")}>
                    {results.length > 0 ? (
                        results.map(r => (
                            <div key={`${r.type}-${r.id}`} className={styles.resultItem}>
                                <div className={styles.resultIcon}>
                                    {r.type === 'project' && <File size={14} />}
                                    {r.type === 'user' && <User size={14} />}
                                    {r.type === 'invoice' && <CreditCard size={14} />}
                                </div>
                                <div>
                                    <p className={styles.resultTitle}>{r.title}</p>
                                    <p className={styles.resultDesc}>{r.desc}</p>
                                </div>
                                <ChevronRight size={14} className={styles.arrow} />
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>No results found for "{query}"</div>
                    )}
                </div>
            )}
        </div>
    );
}
