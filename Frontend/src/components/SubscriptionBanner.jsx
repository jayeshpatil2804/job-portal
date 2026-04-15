import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'

/**
 * SubscriptionBanner
 * - Candidate/Recruiter ke liye subscription status check karta hai
 * - 30 din pehle: top sticky warning banner dikhata hai
 * - Expire hone ke baad: full-screen modal dikhata hai
 */
const SubscriptionBanner = () => {
    const { user } = useSelector((state) => state.auth)
    const [status, setStatus] = useState(null)
    const [dismissed, setDismissed] = useState(false)

    useEffect(() => {
        // Only for paid users (Candidate or Recruiter)
        if (!user || user.role === 'ADMIN') return

        api.get('/payment/subscription-status')
            .then(res => setStatus(res.data))
            .catch(() => {}) // Silent fail
    }, [user])

    if (!status || user?.role === 'ADMIN') return null

    // ─── EXPIRED MODAL ────────────────────────────────────────
    if (status.isExpired) {
        return (
            <div style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem'
            }}>
                <div style={{
                    background: '#fff',
                    borderRadius: '1.25rem',
                    padding: '2.5rem',
                    maxWidth: '460px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                    animation: 'subModalIn 0.35s cubic-bezier(0.22,1,0.36,1)'
                }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ff4d4f, #ff7a45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        fontSize: '2rem'
                    }}>⏰</div>
                    <h2 style={{
                        fontSize: '1.5rem', fontWeight: 800,
                        color: '#0f172a', marginBottom: '0.5rem'
                    }}>
                        Subscription Expire Ho Gaya
                    </h2>
                    <p style={{
                        color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem'
                    }}>
                        Aapka yearly subscription khatam ho gaya hai. Sabhi features use karne ke liye
                        please apna plan renew karein.
                    </p>
                    <button
                        onClick={() => window.location.href = '/payment'}
                        style={{
                            width: '100%', padding: '0.85rem',
                            background: 'linear-gradient(135deg, #1a3c8f, #2563eb)',
                            color: '#fff', border: 'none', borderRadius: '0.75rem',
                            fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                            letterSpacing: '0.02em'
                        }}
                    >
                        🔄 Abhi Renew Karo
                    </button>
                </div>

                <style>{`
                    @keyframes subModalIn {
                        from { opacity: 0; transform: scale(0.88); }
                        to   { opacity: 1; transform: scale(1); }
                    }
                `}</style>
            </div>
        )
    }

    // ─── EXPIRING SOON BANNER ─────────────────────────────────
    if (status.isExpiringSoon && !dismissed) {
        const isUrgent = status.daysRemaining <= 7

        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
                background: isUrgent
                    ? 'linear-gradient(90deg, #dc2626, #ef4444)'
                    : 'linear-gradient(90deg, #d97706, #f59e0b)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0.65rem 1rem',
                gap: '0.75rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                animation: 'slideDown 0.3s ease'
            }}>
                <span style={{ fontSize: '1.1rem' }}>{isUrgent ? '🔴' : '⚠️'}</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    Aapka subscription sirf <strong>{status.daysRemaining} din</strong> me expire hoga &mdash; &nbsp;
                    <a href="/payment" style={{
                        color: '#fff', textDecoration: 'underline', fontWeight: 700
                    }}>
                        Abhi Renew Karo
                    </a>
                </span>
                <button
                    onClick={() => setDismissed(true)}
                    style={{
                        marginLeft: 'auto', background: 'rgba(255,255,255,0.2)',
                        border: 'none', color: '#fff', borderRadius: '50%',
                        width: '26px', height: '26px', cursor: 'pointer',
                        fontSize: '0.9rem', lineHeight: '26px', textAlign: 'center'
                    }}
                    title="Dismiss"
                >
                    ✕
                </button>

                <style>{`
                    @keyframes slideDown {
                        from { transform: translateY(-100%); opacity: 0; }
                        to   { transform: translateY(0);     opacity: 1; }
                    }
                `}</style>
            </div>
        )
    }

    return null
}

export default SubscriptionBanner
