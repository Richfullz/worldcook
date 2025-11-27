import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function CreateRecipe() {
    const navigate = useNavigate();
    const [stepPreviews, setStepPreviews] = useState([]);
    const [coverPreview, setCoverPreview] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        prepTime: '',
        cookTime: '',
        servings: '',
        category: '',
        diet: '',
        allergens: '',
    });
    const getStepText = (list) => {
        const n = list.length;
        if (n === 0) return 'Ningún archivo seleccionado';
        return `${n} archivo${n > 1 ? 's' : ''} seleccionado${n > 1 ? 's' : ''}`;
    };
    const [coverFile, setCoverFile] = useState(null);
    const [stepFiles, setStepFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
        setLoading(true);
        const ingredientsArray = formData.ingredients.split(',').map(i => i.trim());
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
        stepFiles.forEach((file) => data.append('images', file));

        try {
            await axios.post('/recipes/create', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('¡Receta creada con éxito!');
            navigate('/my-recipes');
        } catch (err) {
            alert('Error al crear receta: ' + (err.response?.data?.message || 'Desconocido'));
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="create-recipe-page">
            <Link to="/my-recipes" className="back-myrecipes-btn">⬅ Volver a Mis Recetas</Link>
            <h2 className="create-recipe-title">🍳 Crea tu obra maestra culinaria</h2>

            <form className="create-recipe-form" onSubmit={handleSubmit}>
                <label>
                    <span>🍽️ Título de la receta</span>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Ej: Risotto de champiñones" />
                </label>

                <label>
                    <span>📖 Descripción</span>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Una breve historia o descripción de tu receta..."></textarea>
                </label>

                <label>
                    <span>🥕 Ingredientes</span>
                    <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={4} placeholder="200g arroz, 1 cebolla, 500ml caldo..."></textarea>
                </label>

                <label>
                    <span>👨‍🍳 Pasos</span>
                    <textarea name="steps" value={formData.steps} onChange={handleChange} rows={6} placeholder="1. Sofríe la cebolla..."></textarea>
                </label>

                <div className="time-grid">
                    <label>
                        <span>⏱️ Prep (min)</span>
                        <input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} min="1" />
                    </label>
                    <label>
                        <span>🔥 Cocción (min)</span>
                        <input type="number" name="cookTime" value={formData.cookTime} onChange={handleChange} min="0" />
                    </label>
                    <label>
                        <span>🍽️ Porciones</span>
                        <input type="number" name="servings" value={formData.servings} onChange={handleChange} min="1" />
                    </label>
                </div>

                <label>
                    <span>🌍 Categoría</span>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Italiana, Vegana, Postre..." />
                </label>

                <label>
                    <span>🥗 Dieta</span>
                    <input type="text" name="diet" value={formData.diet} onChange={handleChange} placeholder="Ej: Vegana, Sin gluten, Keto..." />
                </label>

                <label>
                    <span>⚠️ Alérgenos</span>
                    <input type="text" name="allergens" value={formData.allergens} onChange={handleChange} placeholder="Ej: Gluten, Lácteos, Frutos secos..." />
                </label>
                <label>
                    <span>📸 Imagen de portada</span>
                    <div className="avatar-preview-box">
                        <img
                            src={coverPreview || '/src/assets/user.png'}
                            alt="Preview"
                            className="profile-avatar"
                        />
                        <div className='button-avatar-select'>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverChange}
                            />
                            {coverPreview && coverPreview !== '/src/assets/user.png' && (
                                <button
                                    type="button"
                                    className="remove-avatar-btn"
                                    onClick={handleRemoveCover}
                                >
                                    Quitar imagen
                                </button>
                            )}
                        </div>
                    </div>
                </label>

                <label>
                    <span>🖼️ Imágenes de pasos (máx. 10)</span>
                    <div className="avatar-preview-box">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleStepsChange}
                            style={{ display: 'none' }}
                        />
                        <div className='button-avatar-select'>
                            <button
                                type="button"
                                className="wc-btn-secondary"
                                onClick={(e) => e.currentTarget.previousElementSibling.click()}
                            >
                                📎 Elegir archivos
                            </button>
                            <span className="fake-file-text">{getStepText(stepFiles)}</span>
                        </div>
                    </div>
                </label>

                {stepFiles.length > 0 && (
                    <div className="step-images-preview">
                        {stepFiles.map((file, idx) => (
                            <div key={idx} className="step-img-box">
                                <img src={stepPreviews[idx]} alt={`Paso ${idx + 1}`} className="step-thumb" />
                                <span className="step-name">{file.name}</span>
                                <button
                                    type="button"
                                    className="remove-step-btn"
                                    onClick={() => handleRemoveStepImage(idx)}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button type="submit" className="wc-btn-primary large" disabled={loading}>
                    {loading ? 'Creando...' : '✨ Crear receta'}
                </button>
            </form>
        </main>
    );
}