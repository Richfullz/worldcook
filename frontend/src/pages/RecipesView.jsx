import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import LikeButton from '../components/LikeButton';
import FavoriteButton from '../components/FavoriteButton';
import RatingStars from '../components/RatingStars';
import CommentList from '../components/CommentList';

export default function RecipeView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
    }, []);

    useEffect(() => {
        axios.get(`/recipes/view/${id}`)
            .then(res => setRecipe(res.data))
            .catch(() => {
                alert('Receta no encontrada');
                navigate('/recipes');
            })
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return <p className="loading-msg">Cargando receta...</p>;
    if (!recipe) return <p>Receta no encontrada</p>;

    const isOwner = user && user._id === recipe.author._id;

    return (
        <main className="recipe-view-page">
            <div className="recipe-hero-top">
                <div className="recipe-top-bar">
                    <div className="rv-btn-group rv-left">
                        <Link to="/" className="rv-btn nav">🏠 Home</Link>
                        <Link to="/recipes" className="rv-btn nav">📖 Recetas</Link>
                        <Link to="/profile" className="rv-btn nav">👤 Perfil</Link>
                    </div>

                    {/* ✅ SIEMPRE visible: like, fav, rating */}
                    <div className="rv-btn-group rv-center">
                        <LikeButton recipeId={id} user={user} />
                        <FavoriteButton recipeId={id} user={user} />
                    </div>

                    {/* ✅ Solo si es mi receta: editar/eliminar */}
                    {isOwner && (
                        <div className="rv-btn-group rv-right">
                            <Link to={`/recipes/edit/${recipe._id}`} className="wc-btn-primary">✏️ Editar</Link>
                            <button
                                className="wc-btn-danger"
                                onClick={() => {
                                    if (window.confirm('¿Eliminar esta receta?')) {
                                        axios.delete(`/recipes/${recipe._id}`)
                                            .then(() => {
                                                alert('Receta eliminada');
                                                navigate('/my-recipes');
                                            })
                                            .catch(() => alert('Error al eliminar'));
                                    }
                                }}
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    )}
                </div>

                <h1 className="recipe-title">{recipe.title}</h1>
                <p className="recipe-author">
                    👤 Receta creada por: <strong>{recipe.author?.nickname || recipe.author?.name || 'Autor desconocido'}</strong>
                </p>

            </div>

            {/* ===== 2. IMAGEN COVER ===== */}
            {recipe.imageCover && (
                <img
                    src={`http://localhost:5000${recipe.imageCover}`}
                    alt={recipe.title}
                    className="recipe-cover"
                />
            )}

            {/* ===== 3. INFO GRID ===== */}
            <div className="recipe-info-grid">
                <div className="info-item"><span className="label">⏱️ Tiempo total</span><span className="value">{recipe.totalTime} min</span></div>
                <div className="info-item"><span className="label">🍽️ Porciones</span><span className="value">{recipe.servings}</span></div>
                <div className="info-item"><span className="label">🌍 Categoría</span><span className="value">{recipe.category || '—'}</span></div>
                <div className="info-item"><span className="label">🥗 Dieta</span><span className="value">{recipe.diet.join(', ') || '—'}</span></div>
                <div className="info-item"><span className="label">⚠️ Alérgenos</span><span className="value">{recipe.allergens.join(', ') || '—'}</span></div>
            </div>

            {/* ===== 4. CONTENIDO ===== */}
            <div className="recipe-content">
                <div className="recipe-section">
                    <h3>Descripción</h3>
                    <p>{recipe.description || 'Sin descripción.'}</p>
                </div>

                <div className="recipe-section">
                    <h3>Ingredientes</h3>
                    <ul>
                        {recipe.ingredients.map((ing, i) => (
                            <li key={i}><span>✔️</span> {ing}</li>
                        ))}
                    </ul>
                </div>

                <div className="recipe-section">
                    <h3>Pasos</h3>
                    <ol>
                        {recipe.steps.map((step, i) => (
                            <li key={i}><span>{i + 1}.</span> {step}</li>
                        ))}
                    </ol>
                </div>

                {recipe.images.length > 0 && (
                    <div className="recipe-section">
                        <h3>Galería</h3>
                        <div className="recipe-images-grid">
                            {recipe.images.map((img, i) => (
                                <img key={i} src={`http://localhost:5000${img}`} alt={`Paso ${i + 1}`} className="gallery-img" />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <p>Dejanos un comentario y una reseña, para nosotros es muuuuy Importante!🙂</p>
            <div className="recipe-interactions-top">
                <RatingStars recipeId={id} user={user} />
            </div>
            <CommentList recipeId={id} user={user} />
        </main>
    );
}