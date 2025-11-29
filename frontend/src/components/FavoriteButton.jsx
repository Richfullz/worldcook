import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function FavoriteButton({ recipeId, user }) {
    const [favorited, setFavorited] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        axios.get(`/favorites/count/${recipeId}`).then(res => setCount(res.data.count)).catch(() => { });
        if (!user) return;
        axios.get(`/favorites/status/${recipeId}`).then(res => setFavorited(res.data.favorited)).catch(() => { });
    }, [recipeId, user]);

    const toggle = async () => {
        if (!user) return;
        const res = await axios.post(`/favorites/toggle/${recipeId}`);
        setFavorited(res.data.favorited);
        setCount(prev => res.data.favorited ? prev + 1 : prev - 1);
    };

    if (!user) return null;

    return (
        <button className={`fav-btn ${favorited ? 'saved' : ''}`} onClick={toggle}>
            <span className="icon">{favorited ? '💾' : '📥'}</span>
            <span className="label">{favorited ? 'Guardado' : 'Guardar'}</span>
            <span className="count">{count}</span>
        </button>
    );
} import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // URL híbrida: producción o local
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
    }, []);

    const handleLogout = () => setShowLogoutModal(true);

    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <header className="wc-header">
            <h1 className="wc-logo">WorldCook</h1>

            <nav className="wc-nav">
                {user ? (
                    <>
                        <span className="user-info">
                            <img
                                src={user.avatar ? `${baseUrl}${user.avatar}` : 'src/assets/user.png'}
                                alt="Avatar"
                                className="header-avatar"
                            />
                            <span className="header-name">Bienvenido {user.nickname}!</span>
                        </span>
                        <a href="/profile" className="wc-btn-secondary">👤 Ver perfil</a>
                        <button className="rv-btn delete" onClick={handleLogout}>
                            Cerrar sesión
                        </button>
                        {showLogoutModal && (
                            <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
                                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                                    <p className="modal-text">¿Estás seguro de que quieres cerrar sesión?</p>
                                    <div className="modal-buttons">
                                        <button className="wc-btn-danger" onClick={confirmLogout}>
                                            Sí, cerrar sesión
                                        </button>
                                        <button
                                            className="wc-btn-secondary"
                                            onClick={() => setShowLogoutModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <a href="/login" className="wc-btn-secondary">Entrar</a>
                        <a href="/register" className="wc-btn-primary">Crear cuenta</a>
                    </>
                )}
            </nav>
        </header>
    );
}