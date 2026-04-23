import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/register', form);
            setSuccess('Registered! Redirecting to login...');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Lost & Found</h2>
                <h3 style={styles.subtitle}>Register</h3>
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input style={styles.input} type="text" placeholder="Full Name"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <input style={styles.input} type="email" placeholder="Email"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <input style={styles.input} type="password" placeholder="Password"
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    <button style={styles.btn} type="submit">Register</button>
                </form>
                <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' },
    card: { background: '#fff', padding: '2rem', borderRadius: '12px', width: '360px', boxShadow: '0 2px 16px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', color: '#2563eb', marginBottom: '0.25rem' },
    subtitle: { textAlign: 'center', color: '#555', marginBottom: '1.5rem', fontWeight: 400 },
    input: { width: '100%', padding: '10px', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
    error: { color: 'red', marginBottom: '1rem', fontSize: '13px' },
    success: { color: 'green', marginBottom: '1rem', fontSize: '13px' },
    link: { textAlign: 'center', marginTop: '1rem', fontSize: '13px' }
};