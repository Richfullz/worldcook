export default function MyRecipes() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (!raw) {
            navigate('/login', { replace: true });
            return;
        }
        fetchMyRecipes();
    }, [navigate]);

    const fetchMyRecipes = async () => {
        try {
            const res = await axios.get('/recipes/my');
            setRecipes(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setRecipeToDelete(id);
        setShowModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/recipes/delete/${recipeToDelete}`);
            fetchMyRecipes();
        } catch (err) {
            alert(err.response?.data?.message || 'Error al eliminar');
        } finally {
            setDeleting(false);
            setShowModal(false);
            setRecipeToDelete(null);
        }
    };

    if (loading) return <p className="loading-msg">Cargando tus recetas...</p>;

    return (
        <main className="my-recipes-page">
            <div className="my-recipes-top-bar">
                <Link to="/" className="wc-btn-secondary">🏠 Volver a Home</Link>
                <Link to="/profile" className="wc-btn-secondary">👤 Volver a Perfil</Link>
                <Link to="/recipes/create" className="wc-btn-primary">📕 Crear receta</Link>
            </div>

            <h2 className="my-recipes-title">Mis Recetas 📖</h2>
            <p className="my-recipes-subtitle">Aquí aparecen solo las recetas que tú has creado.</p>

            {recipes.length === 0 ? (
                <p className="my-recipes-empty">Aún no has creado recetas.</p>
            ) : (
                <section className="my-recipes-grid">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe._id}
                            recipe={recipe}
                            showActions={true}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </section>
            )}

            {/* Modal de confirmación (mismo estilo que Profile) */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <p className="modal-text">¿Estás seguro de eliminar esta receta? 😨</p>
                        <div className="modal-buttons">
                            <button className="wc-btn-danger" onClick={handleDeleteConfirm} disabled={deleting}>
                                {deleting ? 'Eliminando...🚨' : 'Sí, eliminar ⚡'}
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