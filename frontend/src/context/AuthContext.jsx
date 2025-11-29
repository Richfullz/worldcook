import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (u, token) => {
        localStorage.setItem('token', token);
        setUser(u);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        const raw = localStorage.getItem('user');  // ← carga TODO el usuario
        if (raw) {
            const parsed = JSON.parse(raw);          // ← parsea name, avatar, nickname, etc.
            setUser(parsed);                         // ← ahora SÍ tienes toda la info
        }
    }, []);


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);