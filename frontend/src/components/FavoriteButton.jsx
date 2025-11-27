import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function FavoriteButton({ recipeId, user }) {
    const [favorited, setFavorited] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        axios.get(`/favorites/count/${recipeId}`).then(res => setCount(res.data.count)).catch(() => { });
        if (!user) return;
        axios.get(`/favorites/status/${recipeId}`).then(res => setFavorited(res.data.favorited)).catch(() => { });
    }, [recipeId, user]);

    const toggle = async () => {
        if (!user) return;
        const res = await axios.post(`/favorites/toggle/${recipeId}`);
        setFavorited(res.data.favorited);
        setCount(prev => res.data.favorited ? prev + 1 : prev - 1);
    };

    if (!user) return null;

    return (
        <button className={`fav-btn ${favorited ? 'saved' : ''}`} onClick={toggle}>
            <span className="icon">{favorited ? '💾' : '📥'}</span>
            <span className="label">{favorited ? 'Guardado' : 'Guardar'}</span>
            <span className="count">{count}</span>
        </button>
    );
}