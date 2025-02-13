import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AddBodyClass() {
    const location = useLocation();
    
    useEffect(() => {
        // Lista de rotas de formulario de usuario que devem ter o fundo roxo        
        const isUserPage = ['/login', '/cadastro-usuario'].includes(location.pathname);
        
        // Adiciona ou remove a classe com base na rota atual
        if (isUserPage) {
            document.body.classList.add('user-page');            
        } else {
            document.body.classList.remove('user-page');
        }
        
        // Cleanup ao desmontar o componente
        return () => {
            document.body.classList.remove('auth-page');
        };        
        
    }, [location]);

    return null;
} 