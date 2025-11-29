import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function Register() {
    const [preview, setPreview] = useState('/src/assets/user.png');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        nickname: '',
        email: '',
        password: '',
        bio: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!success) return;
        const t = setTimeout(() => setSuccess(false), 3000);
        return () => clearTimeout(t);
    }, [success]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => data.append(key, val));
        if (avatarFile) data.append('avatar', avatarFile);

        try {
            await axios.post('/users/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormData({
                name: '',
                lastName: '',
                nickname: '',
                email: '',
                password: '',
                bio: '',
            });
            setAvatarFile(null);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse');
        }
    };

    return (
        <main className="register-page">
            <a href="/" className="back-home-btn">
                🏠 Home
            </a>
            <h2 className="register-title">Crear cuenta en WorldCook</h2>

            {success && (
                <p className="success-msg">¡Registro exitoso! Redirigiendo a login...</p>
            )}
            {error && <p className="error-msg">{error}</p>}

            <form className="register-form" onSubmit={handleSubmit}>
                <label>
                    👤  Nombre
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    🧑‍🦱 Apellidos
                    <input
                        type="text"
                        name="lastName"
                        required
                        placeholder="Tus apellidos"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    🏷️  Nickname
                    <input
                        type="text"
                        name="nickname"
                        required
                        placeholder="Tu nickname único"
                        value={formData.nickname}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    📧 Email
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="tucorreo@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    🔐 Contraseña
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    📝 Bio
                    <textarea
                        name="bio"
                        rows={3}
                        placeholder="Cuéntanos algo sobre ti..."
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    <span>🖼️ Avatar</span>
                    <div className="avatar-preview-box">
                        <img src={preview} alt="Preview" className="profile-avatar" />
                        <div>
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleFile}
                            />
                            {preview !== '/src/assets/user.png' && (
                                <button
                                    type="button"
                                    className="remove-avatar-btn"
                                    onClick={handleRemoveAvatar}
                                >
                                    ❌ Quitar imagen
                                </button>
                            )}
                        </div>
                    </div>
                </label>

                <button type="submit" className="wc-btn-primary large">
                    🤩 Registrarme
                </button>
            </form>

            <p className="register-footer">
                ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
            </p>
        </main>
    );
}