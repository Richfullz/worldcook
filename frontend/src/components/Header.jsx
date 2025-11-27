import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
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
                                src={user.avatar ? `http://localhost:5000${user.avatar}` : 'src/assets/user.png'}
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