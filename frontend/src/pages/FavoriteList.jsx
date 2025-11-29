import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { getImageUrl } from '../api/images';

export default function FavoriteList() {
    const [favs, setFavs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/favorites/my')
            .then(res => {
                const valid = res.data.filter(f => f.recipe && f.recipe._id);
                setFavs(valid);
                setLoading(false);
            })
            .catch(() => {
                setFavs([]);
                setLoading(false);
            });
    }, []);

    const handleRemove = async (favId, recipeId) => {
        await axios.post(`/favorites/toggle/${recipeId}`);
        setFavs(prev => prev.filter(f => f._id !== favId));
    };

    if (loading) return <p className="loading-msg">Cargando favoritos...</p>;

    if (!favs.length) return (
        <main className="fav-page-empty">
            <h2>💾 Recetas guardadas</h2>
            <p className="empty-text">No tienes recetas guardadas aún.</p>
            <Link to="/recipes" className="wc-btn-primary">Explorar recetas</Link>

            {/* NAVEGACIÓN VACÍO */}
            <div className="fav-nav-empty">
                <Link to="/" className="wc-btn-secondary">🏠 Volver a Home</Link>
                <Link to="/profile" className="wc-btn-secondary">👤 Mi perfil</Link>
            </div>
        </main>
    );

    return (
        <main className="fav-page-grid">
            {/* HEADER CON NAVEGACIÓN */}
            <div className="fav-header">
                <h2>💾 Tus Recetas guardadas</h2>
                <div className="fav-nav">
                    <Link to="/" className="wc-btn-secondary small">🏠 Home</Link>
                    <Link to="/profile" className="wc-btn-secondary small">👤 Mi perfil</Link>
                </div>
            </div>

            <div className="fav-grid">
                {favs.map(f => (
                    <div key={f._id} className="fav-card">
                        <img
                            src={getImageUrl(f.recipe.imageCover || '/default-recipe.png')}
                            alt={f.recipe.title || 'Receta'}
                            className="fav-img"
                        />
                        <h3>{f.recipe.title || 'Sin título'}</h3>
                        <p>⏱️ {f.recipe.totalTime || '—'} min</p>

                        {/* BOTÓN DE ACCIÓN */}
                        <div className="fav-actions">
                            <Link to={`/recipes/view/${f.recipe._id}`} className="wc-btn-secondary small">
                                Ver receta
                            </Link>
                            <button
                                className="wc-btn-danger small"
                                onClick={() => handleRemove(f._id, f.recipe._id)}
                                title="Quitar de guardados"
                            >
                                💔 Quitar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}