const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('IMAGE BASE URL:', baseUrl); // ← línea temporal
export const getImageUrl = (path) => `${baseUrl}${path}`; import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function CommentList({ recipeId, user }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [avatars, setAvatars] = useState({});
    const [nicknames, setNicknames] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        if (!user) return;

        axios.get(`/comments/view/${recipeId}`)
            .then(res => {
                setComments(res.data);

                res.data.forEach(c => {
                    // Avatar
                    if (c.user._id && !c.user.avatar) {
                        axios.get(`/users/avatar/${c.user._id}`, { responseType: 'blob' })
                            .then(imgRes => {
                                const url = URL.createObjectURL(imgRes.data);
                                setAvatars(prev => ({ ...prev, [c.user._id]: url }));
                            })
                            .catch(() => {
                                setAvatars(prev => ({ ...prev, [c.user._id]: '/default-avatar.png' }));
                            });
                    }

                    // Nickname
                    if (c.user._id && !c.user.nickname) {
                        axios.get(`/users/profile/${c.user._id}`)
                            .then(profileRes => {
                                const nick = profileRes.data.nickname || profileRes.data.name;
                                setNicknames(prev => ({ ...prev, [c.user._id]: nick }));
                            })
                            .catch(() => {
                                setNicknames(prev => ({ ...prev, [c.user._id]: c.user.name }));
                            });
                    }
                });
            })
            .catch(() => { });
    }, [recipeId, user]);

    const handleAdd = async () => {
        if (!text.trim() || !user) return;
        const res = await axios.post(`/comments/add/${recipeId}`, { text });
        setComments([res.data, ...comments]);
        setText('');
    };

    const handleDelete = async commentId => {
        await axios.delete(`/comments/delete/${commentId}`);
        setComments(comments.filter(c => c._id !== commentId));
    };

    const startEdit = (comment) => {
        setEditingId(comment._id);
        setEditText(comment.text);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const saveEdit = async (commentId) => {
        if (!editText.trim()) return;
        await axios.put(`/comments/update/${commentId}`, { text: editText });
        setComments(comments.map(c =>
            c._id === commentId ? { ...c, text: editText } : c
        ));
        cancelEdit();
    };

    const formatDate = date => new Date(date).toLocaleDateString('es-ES');

    const getAvatarSrc = (c) => {
        if (c.user.avatar) return `http://localhost:5000${c.user.avatar}`;
        if (avatars[c.user._id]) return avatars[c.user._id];
        return '/default-avatar.png';
    };

    const getUserName = (c) => {
        if (c.user.nickname) return c.user.nickname;
        if (nicknames[c.user._id]) return nicknames[c.user._id];
        return c.user.name;
    };

    if (!user) return null;

    return (
        <div className="comment-section">
            <h4>Comentarios</h4>
            <div className="comment-input-box">
                <textarea
                    placeholder="Escribe tu comentario..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={3}
                />
                <button onClick={handleAdd}>Enviar</button>
            </div>
            <div className="comment-list">
                {comments.map(c => (
                    <div key={c._id} className="comment-card">
                        <img
                            src={getAvatarSrc(c)}
                            alt={getUserName(c)}
                            className="avatar"
                        />

                        <div className="comment-content">
                            {editingId === c._id ? (
                                <div className="edit-box">
                                    <textarea
                                        value={editText}
                                        onChange={e => setEditText(e.target.value)}
                                        rows={3}
                                    />
                                    <div className="edit-actions">
                                        <button onClick={() => saveEdit(c._id)}>Guardar</button>
                                        <button onClick={cancelEdit}>Cancelar</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="comment-header">
                                        <span className="name">{getUserName(c)}</span>

                                        {user._id === c.user._id && (
                                            <div className="comment-actions">
                                                <button className="edit-comment-btn" onClick={() => startEdit(c)} title="Editar">✏️</button>
                                                <button className="delete-comment-btn" onClick={() => handleDelete(c._id)} title="Borrar">❌</button>
                                            </div>
                                        )}
                                    </div>
                                    <p>{c.text}</p>
                                    <span className="comment-date">{formatDate(c.createdAt)}</span>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}