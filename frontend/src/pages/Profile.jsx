import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import { getImageUrl } from '../api/images'; // ← importación

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [farewell, setFarewell] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (!raw) {
            navigate('/login', { replace: true });
            return;
        }
        setUser(JSON.parse(raw));
    }, [navigate]);

    const handleDelete = async () => {
        setShowModal(false);
        setDeleting(true);
        try {
            await axios.delete(`/users/delete/${user._id}`);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setFarewell(true);
            setTimeout(() => {
                setFarewell(false);
                navigate('/', { replace: true });
            }, 3000);
        } catch (err) {
            setDeleting(false);
            alert(err.response?.data?.message || 'Error al eliminar cuenta');
        }
    };

    return (
        <main className="profile-page">
            {farewell && (
                <div className="farewell-box">
                    <span className="farewell-emoji">👋</span>
                    <p className="farewell-text">¡Hasta la próxima!</p>
                </div>
            )}

            <Link to="/" className="rv-btn nav">🏠 Home</Link>
            <h2 className="profile-title">Mi Perfil</h2>

            <div className="profile-avatar-box">
                <img
                    src={user?.avatar ? getImageUrl(user.avatar) : '/default-avatar.png'}
                    alt="Avatar"
                    className="profile-avatar"
                />
            </div>

            <div className="profile-data">
                <p><strong>👤 Nombre:</strong> {user?.name} {user?.lastName}</p>
                <p><strong>🏷️ Nickname:</strong> {user?.nickname}</p>
                <p><strong>📧 Email:</strong> {user?.email}</p>
                <p><strong>📝 Bio:</strong> {user?.bio || 'Sin bio'}</p>
            </div>

            <div className="profile-actions">
                <Link to="/my-recipes" className="wc-btn-primary">📘 Mis recetas</Link>
                <Link to="/recipes/create" className="wc-btn-primary">📕 Crear receta</Link>
                <Link to="/profile/edit" className="wc-btn-primary">✍🏼Editar perfil</Link>
                <Link to="/mis-favoritos" className="wc-btn-primary">💾 Recetas guardadas</Link>

                <button
                    className="wc-btn-danger"
                    onClick={() => setShowModal(true)}
                    disabled={deleting}
                >
                    {deleting ? 'Eliminando...🚨' : 'Eliminar cuenta🔴'}
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <p className="modal-text">¿Estás seguro de eliminar tu cuenta? 😰</p>
                        <div className="modal-buttons">
                            <button className="wc-btn-danger" onClick={handleDelete}>
                                Sí, eliminar ☠️
                            </button>
                            <button className="wc-btn-secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}