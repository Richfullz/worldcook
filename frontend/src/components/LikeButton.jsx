import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function LikeButton({ recipeId, user }) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(0);
    const [showList, setShowList] = useState(false);
    const [likers, setLikers] = useState([]);
    const [avatars, setAvatars] = useState({});

    useEffect(() => {
        axios.get(`/likes/count/${recipeId}`).then(res => setCount(res.data.likesCount)).catch(() => { });
        if (!user) return;
        axios.get(`/likes/status/${recipeId}`).then(res => setLiked(res.data.liked)).catch(() => { });
    }, [recipeId, user]);

    const handleLike = async () => {
        if (!user) return;
        const res = await axios.post(`/likes/toggle/${recipeId}`);
        setLiked(res.data.liked);
        setCount(prev => res.data.liked ? prev + 1 : prev - 1);
    };

    const openLikers = async () => {
        if (!user) return;
        const res = await axios.get(`/likes/list/${recipeId}`);
        setLikers(res.data);
        res.data.forEach(l => {
            if (l.user._id && !l.user.avatar) {
                axios.get(`/users/avatar/${l.user._id}`, { responseType: 'blob' })
                    .then(imgRes => {
                        const url = URL.createObjectURL(imgRes.data);
                        setAvatars(prev => ({ ...prev, [l.user._id]: url }));
                    })
                    .catch(() => {
                        setAvatars(prev => ({ ...prev, [l.user._id]: '/default-avatar.png' }));
                    });
            }
        });

        setShowList(true);
    };

    const getAvatarSrc = (l) => {
        if (l.user.avatar) return `http://localhost:5000${l.user.avatar}`;
        if (avatars[l.user._id]) return avatars[l.user._id];
        return '/default-avatar.png';
    };

    return (
        <div className="like-component">
            <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                <span className="heart">{liked ? '❤️' : '🤍'}</span>
                <span className="count">{count}</span>
            </button>

            {user && count > 0 && (
                <button className="likers-trigger" onClick={openLikers}>
                    Ver quién
                </button>
            )}

            {showList && (
                <div className="modal-overlay" onClick={() => setShowList(false)}>
                    <div className="modal-content-dark" onClick={e => e.stopPropagation()}>
                        <h3>Me gusta</h3>
                        <ul className="likers-list-dark">
                            {likers.map(l => (
                                <li key={l._id}>
                                    <img src={getAvatarSrc(l)} alt="" />
                                    <span>{l.user.nickname || l.user.name}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="close-modal-btn" onClick={() => setShowList(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}