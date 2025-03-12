import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AddBodyClass() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    
    useEffect(() => {
        // Lista de rotas de formulario de usuario que devem ter o fundo roxo        
        const isUserPage = [
            '/login', 
            '/cadastro-usuario', 
            '/esqueci-senha', 
            '/redefinir-senha',
            '/recuperacao-whatsapp'
        ].includes(location.pathname);
        
        // Adiciona ou remove a classe com base na rota atual
        if (isUserPage) {
            document.body.classList.add('user-page');            
        } else {
            document.body.classList.remove('user-page');
        }
        
        // Limpa classes de rota anteriores (começa com 'route-')
        document.body.classList.forEach(className => {
            if (className.startsWith('route-')) {
                document.body.classList.remove(className);
            }
        });
        
        // Adiciona a rota atual como uma classe
        // Converte a rota para um formato adequado para classe CSS
        const routeClass = 'route-' + location.pathname
            .replace(/^\//, '') // Remove a barra inicial
            .replace(/\//g, '-') // Substitui barras por hífens
            .replace(/:/g, '') // Remove dois pontos (em caso de parâmetros)
            .replace(/[^a-zA-Z0-9-_]/g, '') // Remove caracteres especiais
            || 'home'; // Se estiver vazio (rota raiz), usa 'home'
            
        document.body.classList.add(routeClass);
        
        // Cleanup ao desmontar o componente
        return () => {
            document.body.classList.remove('user-page');
            document.body.classList.remove(routeClass);
        };        
        
    }, [location]);

    // Adiciona classe quando o usuário está logado
    useEffect(() => {
        if (isAuthenticated) {
            document.body.classList.remove('not-logged-in');
            document.body.classList.add('logged-in');
        } else {
            document.body.classList.remove('logged-in');
            document.body.classList.add('not-logged-in');
        }
        
        // Cleanup ao desmontar o componente
        return () => {
            document.body.classList.remove('logged-in');
        };
    }, [isAuthenticated]);

    return null;
} 