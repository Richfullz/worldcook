export const useAuth = () => useContext(AuthContext); import { useEffect, useState, useMemo } from 'react';
import RecipeCard from '../components/RecipeCard';
import axios from '../api/axios';

export default function AllRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    /* Filtros */
    const [search, setSearch] = useState('');
    const [diet, setDiet] = useState('');
    const [maxTime, setMaxTime] = useState('');
    const [allergenInput, setAllergenInput] = useState('');
    const [selectedAllergens, setSelectedAllergens] = useState([]);
    const [showAllergenModal, setShowAllergenModal] = useState(false);

    /* Paginación */
    const PAGE_SIZE = 12;
    const [page, setPage] = useState(1);

    /* Carga inicial */
    useEffect(() => {
        axios.get('/recipes/all')
            .then(res => {
                setRecipes(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    /* Opciones únicas (MEMOIZADAS) */
    const diets = useMemo(
        () => Array.from(new Set(recipes.flatMap(r => r.diet).filter(Boolean))),
        [recipes]
    );
    const allergenOptions = useMemo(
        () => Array.from(new Set(recipes.flatMap(r => r.allergens).filter(Boolean))),
        [recipes]
    );

    /* Limpiar todo */
    const clearFilters = () => {
        setSearch('');
        setDiet('');
        setMaxTime('');
        setSelectedAllergens([]);
        setAllergenInput('');
        setPage(1);
    };

    /* Recetas filtradas */
    const filtered = useMemo(() => {
        return recipes.filter(r => {
            const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
            const matchDiet = !diet || (r.diet && r.diet.includes(diet));
            const matchTime = !maxTime || (r.totalTime && r.totalTime <= Number(maxTime));
            const matchAllergens = selectedAllergens.length === 0 ||
                !selectedAllergens.some(a => r.allergens && r.allergens.includes(a));
            return matchSearch && matchDiet && matchTime && matchAllergens;
        });
    }, [recipes, search, diet, maxTime, selectedAllergens]);

    /* Paginación */
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    if (loading) return <p className="loading-msg">Cargando recetas...</p>;

    return (
        <main className="all-recipes-page">
            <h2 className="all-recipes-title">🌍 Todas las recetas del mundo</h2>
            <section className="all-recipes-filters">
                <input
                    type="text"
                    placeholder="🔍 Buscar por título"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="filter-input"
                />
                {diets.length > 0 && (
                    <select value={diet} onChange={e => setDiet(e.target.value)} className="filter-select">
                        <option value="">Cualquier dieta</option>
                        {diets.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                )}
                <button
                    type="button"
                    className="filter-allergen-trigger"
                    onClick={() => setShowAllergenModal(true)}
                >
                    Alérgenos {selectedAllergens.length > 0 && `(${selectedAllergens.length})`}
                </button>
                <input
                    type="number"
                    placeholder="⏱️ Tiempo max (min)"
                    value={maxTime}
                    onChange={e => setMaxTime(e.target.value)}
                    className="filter-input"
                />

                <button type="button" className="filter-clear-btn" onClick={clearFilters}>
                    Limpiar filtros
                </button>
            </section>
            {showAllergenModal && (
                <div className="modal-overlay" onClick={() => setShowAllergenModal(false)}>
                    <div className="modal-box allergen-modal" onClick={e => e.stopPropagation()}>
                        <h4 className="modal-title">Alérgenos a evitar</h4>

                        <div className="allergen-modal-content">
                            <input
                                type="text"
                                placeholder="Ej: huevos, lacteos, gluten..."
                                value={allergenInput}
                                onChange={e => setAllergenInput(e.target.value)}
                                className="filter-input"
                                list="allergen-datalist"
                            />
                            <datalist id="allergen-datalist">
                                {allergenOptions.map(a => <option key={a} value={a} />)}
                            </datalist>

                            <button
                                type="button"
                                className="wc-btn-primary"
                                onClick={() => {
                                    const trimmed = allergenInput.trim();
                                    if (trimmed && !selectedAllergens.includes(trimmed)) {
                                        setSelectedAllergens([...selectedAllergens, trimmed]);
                                        setAllergenInput('');
                                    }
                                }}
                            >
                                Añadir
                            </button>
                            {selectedAllergens.length > 0 && (
                                <div className="allergen-tags-modal">
                                    {selectedAllergens.map(a => (
                                        <span key={a} className="allergen-tag-modal">
                                            {a}
                                            <button type="button" onClick={() => setSelectedAllergens(selectedAllergens.filter(x => x !== a))}>
                                                ❌
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="modal-buttons">
                            <button className="wc-btn-secondary" onClick={() => setShowAllergenModal(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {paginated.length === 0 ? (
                <p className="empty-msg">
                    {search || diet || maxTime || selectedAllergens.length
                        ? 'No hay recetas con esos filtros.'
                        : 'Aún no hay recetas. Sé el primero en compartir la tuya.'}
                </p>
            ) : (
                <>
                    <section className="all-recipes-grid-responsive">
                        {paginated.map(r => (
                            <div key={r._id} className="recipe-card-shrink">
                                <RecipeCard recipe={r} />
                            </div>
                        ))}
                    </section>
                    <a href="/" className="back-home-btn">
                        🏠 Home
                    </a>
                    {totalPages > 1 && (
                        <nav className="pagination-numbers">
                            <button
                                className="page-arrow"
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                            >
                                ⬅
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`page-number ${n === page ? 'active' : ''}`}
                                >
                                    {n}
                                </button>
                            ))}

                            <button
                                className="page-arrow"
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                            >
                                ➡
                            </button>
                        </nav>
                    )}
                </>
            )}
        </main>
    );
}