import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

export default function Home() {
    const [stats, setStats] = useState({ totalRecipes: 0, totalUsers: 0, uniqueCountries: 0 });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));

        axios.get('/users/stats')
            .then(res => setStats(res.data))
            .catch(() => setStats({ totalRecipes: 0, totalUsers: 0, uniqueCountries: 0 }));
    }, []);

    return (
        <>
            <Header />

            <section className="hero">
                <div className="hero-content">
                    <h2 className="hero-title">
                        Cocina. Comparte. <span className="highlight">Explora.</span>
                    </h2>
                    <p className="hero-subtitle">
                        La cocina es cultura. Sube tus recetas, descubre sabores del planeta
                        y conecta con cocineros de todo el mundo.
                    </p>
                    <div className="hero-cta">
                        {!user && (
                            <Link to="/register" className="wc-btn-primary large">
                                💘 Únete ahora
                            </Link>
                        )}
                        <Link to="/recipes" className="wc-btn-primary large">
                            👀 Ver recetas
                        </Link>
                    </div>
                </div>
                <div className="hero-visual">
                    <img src="/worldcook-1.png" alt="WorldCook" className="image-home" />
                </div>
            </section>

            <section className="stats-bar">
                <div className="stat">
                    <span className="stat-number">{stats.totalRecipes}</span>
                    <span className="stat-label">Recetas</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{stats.totalUsers}</span>
                    <span className="stat-label">Cocineros</span>
                </div>
            </section>

            <footer className="main-footer">
                <small>© 2025 WorldCook – Hecho con 💛 y fuego RichFullz.</small>
            </footer>
        </>
    );
}