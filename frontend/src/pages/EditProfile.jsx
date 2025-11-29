import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function EditProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    /* Estados del formulario */
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        nickname: '',
        email: '',
        bio: '',
        password: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState('/src/assets/user.png');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    /* Redirección si no hay usuario */
    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (!raw) {
            navigate('/login', { replace: true });
            return;
        }
        setUser(JSON.parse(raw));
    }, [navigate]);

    /* Cuando llega el usuario → precargamos todo */
    useEffect(() => {
        if (!user) return;
        setFormData({
            name: user.name,
            lastName: user.lastName,
            nickname: user.nickname,
            email: user.email,
            bio: user.bio,
            password: '',
        });
        setPreview(user.avatar ? `http://localhost:5000${user.avatar}` : '/src/assets/user.png');
    }, [user]);

    /* Handlers */
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFile = e => {
        const file = e.target.files[0];
        if (!file) {
            setPreview('/src/assets/user.png');
            setAvatarFile(null);
            return;
        }
        setAvatarFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setPreview('/src/assets/user.png');
        setAvatarFile(null);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v));
        if (avatarFile) data.append('avatar', avatarFile);

        try {
            const res = await axios.put(`/users/update/${user._id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            /* Guardamos usuario actualizado */
            localStorage.setItem('user', JSON.stringify(res.data));
            setSuccess(true);
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar');
        }
    };

    if (!user) return <p className="loading-msg">Cargando perfil...</p>;

    return (
        <main className="edit-profile-page">
            <Link to="/profile" className="back-profile-btn">👤 Volver a Perfil</Link>
            <h2 className="edit-profile-title">Editar Perfil</h2>

            {success && <p className="success-msg">¡Perfil actualizado! Redirigiendo...</p>}
            {error && <p className="error-msg">{error}</p>}

            <form className="edit-profile-form" onSubmit={handleSubmit}>
                <label>👤 Nombre<input type="text" name="name" required value={formData.name} onChange={handleChange} /></label>
                <label>🧑‍🦱 Apellidos<input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} /></label>
                <label>🏷️ Nickname<input type="text" name="nickname" required value={formData.nickname} onChange={handleChange} /></label>
                <label>📧 Email<input type="email" name="email" required value={formData.email} onChange={handleChange} /></label>
                <label>🔐 Contraseña (solo si quieres cambiarla)<input type="password" name="password" placeholder="Deja vacío para mantener la actual" onChange={handleChange} /></label>
                <label>📝 Bio<textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} /></label>
                <label>🖼️ Avatar
                    <img src={preview} alt="Preview" className="profile-avatar" />
                    <div className="avatar-preview-box">
                        <input type="file" name="avatar" accept="image/*" onChange={handleFile} />
                        {avatarFile && (
                            <button type="button" className="remove-avatar-btn" onClick={handleRemoveAvatar}>
                                ❌   Quitar imagen
                            </button>
                        )}
                    </div>
                </label>

                <button type="submit" className="wc-btn-primary large">
                    💾  Guardar cambios
                </button>
            </form>
        </main>
    );
}