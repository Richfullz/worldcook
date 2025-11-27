import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function RatingStars({ recipeId, user }) {
    const [current, setCurrent] = useState(0);
    const [hover, setHover] = useState(0);
    const [average, setAverage] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        axios.get(`/ratings/get/${recipeId}`).then(res => {
            setAverage(res.data.averageRating);
            setTotal(res.data.totalRatings);
        }).catch(() => { });

        if (!user) return;
        axios.get(`/ratings/my/${recipeId}`).then(res => setCurrent(res.data.myRating)).catch(() => { });
    }, [recipeId, user]);

    const handleRate = async score => {
        if (!user) return;
        const res = await axios.post(`/ratings/add/${recipeId}`, { score });
        setCurrent(res.data.score);
        setAverage(res.data.averageRating);
        setTotal(res.data.totalRatings);
    };

    const percentage = average > 0 ? Math.round((average / 5) * 100) : 0;

    return (
        <div className="rating-component">
            <div className="rating-bar">
                <div className="rating-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="rating-info">
                <span className="rating-text">{percentage}%</span>
                <span className="rating-votes">{total} voto{total !== 1 && 's'}</span>
            </div>

            {user && (
                <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            className={`star ${star <= (hover || current) ? 'filled' : ''}`}
                            onClick={() => handleRate(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            title={`${star} estrella${star > 1 ? 's' : ''}`}
                        >
                            ⭐
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}