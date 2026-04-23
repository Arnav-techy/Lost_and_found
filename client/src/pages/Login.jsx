import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/login', form);
            login(data.user, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Lost & Found</h2>
                <h3 style={styles.subtitle}>Login</h3>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input style={styles.input} type="email" placeholder="Email"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <input style={styles.input} type="password" placeholder="Password"
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                    <button style={styles.btn} type="submit">Login</button>
                </form>
                <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
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
    btn: { width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
    error: { color: 'red', marginBottom: '1rem', fontSize: '13px' },
    link: { textAlign: 'center', marginTop: '1rem', fontSize: '13px' }
};