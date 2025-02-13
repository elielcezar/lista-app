import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar o token ao iniciar
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        console.log('Token:', token);
        if (token) {
            setIsAuthenticated(true);
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        // Garantir que o role está incluído nos dados do usuário
        const userWithRole = {
            ...userData,
            role: userData.role || 'colaborador' // valor padrão caso não venha
        };
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        setUser(userWithRole);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Função auxiliar para verificar permissões
    const hasRole = (roles) => {
        if (!user) return false;
        if (typeof roles === 'string') return user.role === roles;
        return roles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            logout, 
            loading,
            hasRole // Exportando a função auxiliar
        }}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}