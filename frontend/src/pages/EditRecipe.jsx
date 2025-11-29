import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', description: '', ingredients: '', steps: '', prepTime: '', cookTime: '', servings: '', category: '', diet: '', allergens: '',
    });
    const getStepText = (list) => {
        const n = list.length;
        if (n === 0) return 'Ningún archivo seleccionado';
        return `${n} archivo${n > 1 ? 's' : ''} seleccionado${n > 1 ? 's' : ''}`;
    };
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [stepFiles, setStepFiles] = useState([]);
    const [stepPreviews, setStepPreviews] = useState([]);


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        axios.get(`/recipes/view/${id}`)
            .then(res => {
                const r = res.data;
                setFormData({
                    title: r.title, description: r.description, ingredients: r.ingredients.join('.\n'), steps: r.steps.join('\n'),
                    prepTime: r.prepTime, cookTime: r.cookTime, servings: r.servings, category: r.category,
                    diet: r.diet.join(', '), allergens: r.allergens.join(', '),
                });
                setCoverPreview(r.imageCover ? `http://localhost:5000${r.imageCover}` : '/src/assets/user.png');
                setLoading(false);
            })
            .catch(() => { alert('No se pudo cargar la receta'); navigate('/my-recipes'); });
    }, [id, navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };
    const handleRemoveCover = () => {
        setCoverFile(null);
        setCoverPreview('/src/assets/user.png');
    };
    const handleStepsChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 10) { alert('Máximo 10 imágenes por pasos'); return; }
        setStepFiles(files);
        setStepPreviews(files.map(f => URL.createObjectURL(f)));

    };

    const handleRemoveStepImage = (idx) => {
        const newFiles = stepFiles.filter((_, i) => i !== idx);
        const newPreviews = stepPreviews.filter((_, i) => i !== idx);
        setStepFiles(newFiles);
        setStepPreviews(newPreviews);

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const ingredientsArray = formData.ingredients.split(/[.\n]/).map(i => i.trim()).filter(Boolean);
        const stepsArray = formData.steps.split('\n').map(s => s.trim()).filter(Boolean);
        const dietArray = formData.diet ? formData.diet.split(',').map(d => d.trim()) : [];
        const allergensArray = formData.allergens ? formData.allergens.split(',').map(a => a.trim()) : [];

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('ingredients', JSON.stringify(ingredientsArray));
        data.append('steps', JSON.stringify(stepsArray));
        data.append('prepTime', formData.prepTime);
        data.append('cookTime', formData.cookTime);
        data.append('servings', formData.servings);
        data.append('category', formData.category);
        data.append('diet', JSON.stringify(dietArray));
        data.append('allergens', JSON.stringify(allergensArray));

        if (coverFile) data.append('imageCover', coverFile);
        if (stepFiles.length > 0) {
            stepFiles.forEach((file, idx) => {
                console.log(`📸 ${idx + 1}: ${file.name} - ${file.size} bytes`);
                data.append('images', file);
            });
        }

        try {
            await axios.put(`/recipes/update/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Receta actualizada con éxito');
            navigate('/my-recipes');
        } catch (err) {
            alert(err.response?.data?.message || 'Error al actualizar');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="loading-msg">Cargando receta...</p>;

    return (
        <main className="edit-recipe-page">
            <Link to="/my-recipes" className="wc-btn-secondary">📖 Volver a Mis Recetas</Link>
            <div className="edit-recipe-top-bar"><h2 className="edit-recipe-title">✏️ Editar receta</h2></div>

            <form className="edit-recipe-form" onSubmit={handleSubmit}>
                {/* Campos del formulario */}
                <label><span>🍽️ Título</span><input type="text" name="title" value={formData.title} onChange={handleChange} required /></label>
                <label><span>📖 Descripción</span><textarea name="description" value={formData.description} onChange={handleChange} rows={3} /></label>
                <label><span>🥕 Ingredientes</span><textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={4} placeholder="1 cebolla. 2 tomates." /></label>
                <label><span>👨‍🍳 Pasos</span><textarea name="steps" value={formData.steps} onChange={handleChange} rows={6} placeholder="Un paso por línea" /></label>
                <div className="time-grid">
                    <label><span>⏱️ Prep</span><input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} /></label>
                    <label><span>🔥 Cocción</span><input type="number" name="cookTime" value={formData.cookTime} onChange={handleChange} /></label>
                    <label><span>🍽️ Porciones</span><input type="number" name="servings" value={formData.servings} onChange={handleChange} /></label>
                </div>
                <label><span>🌍 Categoría</span><input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Italiana, Vegana, Postre..." /></label>
                <label><span>🥗 Dieta</span><input type="text" name="diet" value={formData.diet} onChange={handleChange} placeholder="Separadas por comas: Vegana, Sin gluten..." /></label>
                <label><span>⚠️ Alérgenos</span><input type="text" name="allergens" value={formData.allergens} onChange={handleChange} placeholder="Separados por comas: Gluten, Lácteos..." /></label>
                <label>
                    <span>📸 Nueva imagen de portada</span>
                    <div>
                        <img src={coverPreview || '/src/assets/user.png'} alt="Preview" className="profile-avatar" />
                        <div >
                            <input type="file" accept="image/*" onChange={handleCoverChange} />
                            {coverPreview && coverPreview !== '/src/assets/user.png' && (
                                <button type="button" className="remove-avatar-btn" onClick={handleRemoveCover}>Quitar imagen</button>
                            )}
                        </div>
                    </div>
                </label>
                <label>
                    <span>🖼️ Nuevas imágenes de pasos (máx. 10)</span>
                    <div className="avatar-preview-box">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleStepsChange}
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            className="wc-btn-secondary"
                            onClick={(e) => e.currentTarget.previousElementSibling.click()}
                        >
                            📎 Elegir archivos
                            <span className="fake-file-text">{getStepText(stepFiles)}</span>
                        </button>
                    </div>
                    <p className="file-help">💡 Mantén <strong>Ctrl</strong> para seleccionar varias.</p>
                </label>
                {stepFiles.length > 0 && (
                    <div className="step-images-preview">
                        {stepFiles.map((file, idx) => (
                            <div key={idx} className="step-img-box">
                                <img src={stepPreviews[idx]} alt={`Paso ${idx + 1}`} className="step-thumb" />
                                <span className="step-name">{file.name}</span>
                                <button type="button" className="remove-step-btn" onClick={() => handleRemoveStepImage(idx)}>✖</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="file-status-box">
                    <span className="file-text">{getStepText(stepFiles)}</span>
                    {stepFiles.length > 0 && (
                        <button type="button" className="file-clear-btn" onClick={() => { setStepFiles([]); setStepPreviews([]); }}>❌</button>
                    )}
                </div>

                <button type="submit" className="wc-btn-primary large" disabled={saving}>
                    {saving ? 'Guardando...' : '✅ Guardar cambios'}
                </button>
            </form>
        </main>
    );
}