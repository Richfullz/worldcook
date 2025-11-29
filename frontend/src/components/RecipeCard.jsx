import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe, showActions = false, onDelete }) {
    return (
        <article className="recipe-card">
            <img
                src={recipe.imageCover ? `http://localhost:5000${recipe.imageCover}` : '/src/assets/user.png'}
                alt={recipe.title}
                className="recipe-img"
                onClick={() => window.location.href = `/recipes/view/${recipe._id}`}
                style={{ cursor: 'pointer' }}
            />
            <h3 className="recipe-title">{recipe.title}</h3>
            <p className="recipe-time">⏱️ {recipe.totalTime} min</p>

            {showActions && (
                <div className="recipe-actions">
                    <Link to={`/recipes/edit/${recipe._id}`} className="wc-btn-secondary small">Editar✍🏻</Link>
                    <button className="wc-btn-danger small" onClick={() => onDelete(recipe._id)}>Eliminar🚨</button>
                </div>
            )}

            {!showActions && (
                <div className="recipe-meta">
                    <Link to={`/recipes/view/${recipe._id}`} className="wc-btn-primary small">Ver receta</Link>
                </div>
            )}
        </article>
    );
} import { useState, useMemo } from 'react';
import RecipeCard from './RecipeCard';

export default function RecipeCarousel({ recipes = [], title = 'Recetas' }) {
    const PAGE = 4; // cambiá a 3, 2, etc. si querés
    const [index, setIndex] = useState(0);

    const total = recipes.length;
    const canPrev = index > 0;
    const canNext = index + PAGE < total;

    const pageRecipes = useMemo(() => recipes.slice(index, index + PAGE), [recipes, index]);

    const next = () => setIndex(i => Math.min(i + PAGE, total - PAGE));
    const prev = () => setIndex(i => Math.max(i - PAGE, 0));

    if (!total) return <p className="carousel-empty">No hay recetas para mostrar.</p>;

    return (
        <section className="recipe-carousel">
            <div className="carousel-header">
                <h3 className="carousel-title">{title}</h3>
                <div className="carousel-controls">
                    <button aria-label="Anterior" className="carousel-btn" onClick={prev} disabled={!canPrev}>
                        ⬅
                    </button>
                    <span className="carousel-counter">
                        {index + 1} - {Math.min(index + PAGE, total)} / {total}
                    </span>
                    <button aria-label="Siguiente" className="carousel-btn" onClick={next} disabled={!canNext}>
                        ➡
                    </button>
                </div>
            </div>

            <div className="carousel-track">
                {pageRecipes.map(r => (
                    <div key={r._id} className="carousel-card-wrapper">
                        <RecipeCard recipe={r} />
                    </div>
                ))}
            </div>
        </section>
    );
}