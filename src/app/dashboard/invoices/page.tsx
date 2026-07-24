"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Download, CreditCard, CheckCircle, Plus } from 'lucide-react';
import styles from './invoices.module.css';



export default function InvoicesPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [isPayModalOpen, setPayModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Create Invoice State
    const [newInvoice, setNewInvoice] = useState({ userId: '', amount: '', description: '' });
    const [clients, setClients] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetchInvoices();
            if (user.role === 'admin') {
                fetch('/api/users').then(res => res.json()).then(setClients);
            }
        }
    }, [user]);

    const fetchInvoices = () => {
        fetch(`/api/invoices?role=${user?.role}&userId=${user?.id}`)
            .then(res => res.json())
            .then(setInvoices);
    };

    if (user?.role !== 'client' && user?.role !== 'admin') {
        return <div className="glass p-6">Access Denied</div>;
    }

    const handleCreateInvoice = async () => {
        if (!newInvoice.userId || !newInvoice.amount) {
            alert('Please fill in all fields');
            return;
        }

        const res = await fetch('/api/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newInvoice)
        });

        const data = await res.json();

        if (res.ok) {
            alert('Invoice Created Successfully');
            setCreateModalOpen(false);
            setNewInvoice({ userId: '', amount: '', description: '' });
            fetchInvoices();
        } else {
            alert(`Error: ${data.error || 'Failed to create invoice'}`);
        }
    };

    const handlePay = (inv: any) => {
        setSelectedInvoice(inv);
        setPayModalOpen(true);
    };

    const processPayment = async () => {
        setIsProcessing(true);
        const res = await fetch('/api/invoices', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedInvoice.id, status: 'paid' })
        });

        setIsProcessing(false);
        if (res.ok) {
            setPayModalOpen(false);
            alert(`Payment successful for ${selectedInvoice?.id}!`);
            fetchInvoices();
        } else {
            alert('Payment failed');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Invoices & Billing</h1>
                    <p>Manage your payments and receipts</p>
                </div>
                {user?.role === 'admin' && (
                    <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>
                        <Plus size={18} /> New Invoice
                    </button>
                )}
            </header>

            <div className={styles.list}>
                {invoices.map(inv => (
                    <div key={inv.id} className={styles.invoiceRow}>
                        <div className={styles.invoiceInfo}>
                            <div className={styles.id}>{inv.id}</div>
                            <div className={styles.desc}>{inv.description}</div>
                            <div className={styles.date}>{inv.date}</div>
                        </div>

                        <div className={styles.invoiceActions}>
                            <div className={styles.amount}>${inv.amount.toLocaleString()}</div>
                            <Badge label={inv.status} variant={inv.status === 'paid' ? 'success' : 'warning'} />

                            {inv.status === 'pending' && user.role === 'client' && (
                                <button className={styles.payBtn} onClick={() => handlePay(inv)}>
                                    Pay Now
                                </button>
                            )}

                            <button className={styles.iconBtn}>
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isPayModalOpen}
                onClose={() => setPayModalOpen(false)}
                title="Secure Payment"
            >
                <div className={styles.paymentModal}>
                    <div className={styles.summary}>
                        <span>Total Amount:</span>
                        <span className={styles.bigAmount}>${selectedInvoice?.amount.toLocaleString()}</span>
                    </div>

                    <div className={styles.cardPreview}>
                        <div className={styles.cardIcon}><CreditCard size={24} /></div>
                        <div>
                            <p>•••• •••• •••• 4242</p>
                            <p className={styles.cardSub}>Expires 12/26</p>
                        </div>
                        <CheckCircle size={20} color="var(--success)" style={{ marginLeft: 'auto' }} />
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', marginTop: 20 }}
                        onClick={processPayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Confirm Payment'}
                    </button>
                </div>
            </Modal>

            {/* Admin Create Invoice Modal */}
            <Modal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                title="Create New Invoice"
            >
                <div className={styles.paymentModal} style={{ gap: 12 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>Select Client</label>
                        <select
                            className={styles.input}
                            value={newInvoice.userId}
                            onChange={e => setNewInvoice({ ...newInvoice, userId: e.target.value })}
                            style={{ width: '100%', padding: '10px' }}
                        >
                            <option value="">-- Choose User --</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name} (ID: {c.id}) - {c.role}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>Description</label>
                        <input className={styles.input} type="text" placeholder="Service provided" value={newInvoice.description} onChange={e => setNewInvoice({ ...newInvoice, description: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>Amount ($)</label>
                        <input className={styles.input} type="number" placeholder="0.00" value={newInvoice.amount} onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })} />
                    </div>

                    <button className="btn-primary" onClick={handleCreateInvoice} style={{ marginTop: 12 }}>Create Invoice</button>
                </div>
            </Modal>
        </div>
    );
}
