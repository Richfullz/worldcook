import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/images';

export default function RecipeCard({ recipe, showActions = false, onDelete }) {
    return (
        <article className="recipe-card">
            <img
                src={recipe.imageCover ? getImageUrl(recipe.imageCover) : '/src/assets/user.png'}
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
}