import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ background: 'var(--surface)', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    ⚽ Football Manager
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'var(--text)' }}>My Team</Link>
                    <Link to="/market" style={{ color: 'var(--text)' }}>Transfer Market</Link>
                    <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--error)', color: 'var(--error)', padding: '0.5rem 1rem' }}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
