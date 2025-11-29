import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ login: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('/users/login', formData);
            /* res.data = { token, user: {_id, name, nickname, email, avatar, bio, roles} } */
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            setLoading(false);
            navigate('/');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Credenciales incorrectas');
        }
    };

    return (
        <main className="login-page">
            <a href="/" className="back-home-btn">
                🏠 Home
            </a>
            <h2 className="login-title">Entrar en WorldCook</h2>

            {error && <p className="error-msg">{error}</p>}

            <form className="login-form" onSubmit={handleSubmit}>
                <label>
                    📧 Email o 🏷️ Nickname
                    <input
                        type="text"
                        name="login"
                        required
                        placeholder="tuemail@gmail.com o tu_nickname"
                        value={formData.login}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    🔐 Contraseña
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Tu contraseña"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit" className="wc-btn-primary large" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <p className="login-footer">
                ¿No tienes cuenta? <a href="/register">Crear cuenta</a>
            </p>
        </main>
    );
}