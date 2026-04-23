import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', type: 'lost', location: '', contactInfo: '' });
    const [msg, setMsg] = useState('');

    const fetchItems = async () => {
        const { data } = await API.get('/items');
        setItems(data);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editItem) {
                await API.put(`/items/${editItem._id}`, form);
                setMsg('Item updated!');
                setEditItem(null);
            } else {
                await API.post('/items', form);
                setMsg('Item added!');
            }
            setForm({ title: '', description: '', type: 'lost', location: '', contactInfo: '' });
            fetchItems();
            setTimeout(() => setMsg(''), 2000);
        } catch (err) {
            setMsg(err.response?.data?.message || 'Error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        await API.delete(`/items/${id}`);
        fetchItems();
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setForm({ title: item.title, description: item.description, type: item.type, location: item.location, contactInfo: item.contactInfo });
    };

    const handleSearch = async () => {
        if (!search.trim()) return fetchItems();
        const { data } = await API.get(`/items/search?name=${search}`);
        setItems(data);
    };

    return (
        <div style={styles.page}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <span style={styles.navTitle}>Lost & Found System</span>
                <div>
                    <span style={styles.welcome}>Welcome, {user?.name}</span>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                {/* Add / Edit Form */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>{editItem ? 'Edit Item' : 'Report an Item'}</h3>
                    {msg && <p style={styles.msg}>{msg}</p>}
                    <form onSubmit={handleSubmit}>
                        <input style={styles.input} placeholder="Item Title" value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })} required />
                        <input style={styles.input} placeholder="Description" value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })} />
                        <select style={styles.input} value={form.type}
                            onChange={e => setForm({ ...form, type: e.target.value })}>
                            <option value="lost">Lost</option>
                            <option value="found">Found</option>
                        </select>
                        <input style={styles.input} placeholder="Location" value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })} />
                        <input style={styles.input} placeholder="Contact Info" value={form.contactInfo}
                            onChange={e => setForm({ ...form, contactInfo: e.target.value })} />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={styles.btn} type="submit">{editItem ? 'Update' : 'Submit'}</button>
                            {editItem && <button style={styles.cancelBtn} type="button"
                                onClick={() => { setEditItem(null); setForm({ title: '', description: '', type: 'lost', location: '', contactInfo: '' }); }}>
                                Cancel
                            </button>}
                        </div>
                    </form>
                </div>

                {/* Search */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Search Items</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input style={{ ...styles.input, marginBottom: 0, flex: 1 }} placeholder="Search by name..."
                            value={search} onChange={e => setSearch(e.target.value)} />
                        <button style={styles.btn} onClick={handleSearch}>Search</button>
                        <button style={styles.cancelBtn} onClick={() => { setSearch(''); fetchItems(); }}>Clear</button>
                    </div>
                </div>

                {/* Items List */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>All Items ({items.length})</h3>
                    {items.length === 0 && <p style={{ color: '#888' }}>No items found.</p>}
                    <div style={styles.grid}>
                        {items.map(item => (
                            <div key={item._id} style={styles.itemCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={styles.itemTitle}>{item.title}</h4>
                                    <span style={{ ...styles.badge, background: item.type === 'lost' ? '#fee2e2' : '#dcfce7', color: item.type === 'lost' ? '#dc2626' : '#16a34a' }}>
                                        {item.type.toUpperCase()}
                                    </span>
                                </div>
                                <p style={styles.itemText}>{item.description}</p>
                                <p style={styles.itemText}>📍 {item.location}</p>
                                <p style={styles.itemText}>📞 {item.contactInfo}</p>
                                <p style={styles.itemDate}>{new Date(item.createdAt).toLocaleDateString()}</p>
                                {item.userId === user?.id && (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                        <button style={styles.editBtn} onClick={() => handleEdit(item)}>Edit</button>
                                        <button style={styles.deleteBtn} onClick={() => handleDelete(item._id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: '100vh', background: '#f0f2f5' },
    navbar: { background: '#2563eb', color: '#fff', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    navTitle: { fontSize: '18px', fontWeight: 600 },
    welcome: { marginRight: '1rem', fontSize: '14px' },
    logoutBtn: { padding: '6px 14px', background: '#fff', color: '#2563eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
    content: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' },
    card: { background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
    cardTitle: { marginBottom: '1rem', color: '#1e293b' },
    input: { width: '100%', padding: '10px', marginBottom: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    btn: { padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    cancelBtn: { padding: '10px 20px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    msg: { color: 'green', marginBottom: '1rem', fontSize: '13px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' },
    itemCard: { border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', background: '#fafafa' },
    itemTitle: { margin: 0, color: '#1e293b', fontSize: '15px' },
    itemText: { margin: '4px 0', fontSize: '13px', color: '#555' },
    itemDate: { fontSize: '11px', color: '#aaa', marginTop: '6px' },
    badge: { fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' },
    editBtn: { padding: '5px 12px', background: '#fef9c3', color: '#854d0e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    deleteBtn: { padding: '5px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
};