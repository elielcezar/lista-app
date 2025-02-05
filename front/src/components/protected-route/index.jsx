import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    // Verifica se o token de autenticação está presente
    const isAuthenticated = !!localStorage.getItem('authToken'); 

    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;