import { useState, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import StatusMessage from '@/components/StatusMessage';
import api from '@/services/api'
import styles from './styles.module.css';
import { useAuth } from '@/context/AuthContext';

export const Login = () => { 
    const [confirmationMessage, setConfirmationMessage] = useState({ message: '', type: '' });  
    const inputEmail = useRef(null);
    const inputPassword = useRef(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleLogin(e) {
        e.preventDefault();
        
        try {
            const response = await api.post('/login', {
                email: inputEmail.current.value,
                password: inputPassword.current.value
            });

            if (response.status === 200) {
                const user = response.data.user;
                const tempToken = `temp_token_${user.id}`;
                
                login(user, tempToken);
                setConfirmationMessage({
                    message: 'Login efetuado com sucesso!',
                    type: 'success'
                });
                navigate('/');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setConfirmationMessage({
                message: 'Erro ao fazer login. Verifique suas credenciais.',
                type: 'error'
            });
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }
   
    return (
        <div id="main" className={styles.mainlogin}>
            <div className={`container ${styles.container}`}>        
                {confirmationMessage.message && (
                    <StatusMessage 
                        message={confirmationMessage.message} 
                        type={confirmationMessage.type} 
                    />
                )}
                
                <h1>Lista App</h1>
                <form onSubmit={handleLogin} className={styles.loginForm}>           
                    <div className="form-item">
                        <input 
                            type="email" 
                            name="email" 
                            className="email" 
                            placeholder='Email' 
                            ref={inputEmail}
                            onKeyPress={handleKeyPress}
                            required 
                        />
                    </div>
                    <div className="form-item">
                        <input 
                            type="password" 
                            name="password" 
                            className="password" 
                            placeholder='Senha' 
                            ref={inputPassword}
                            onKeyPress={handleKeyPress}
                            required 
                        />
                    </div>
                    <div className="form-item">
                        <button type='submit'>
                            Enviar
                        </button>
                    </div>
                    <div className="extras">
                        <p>Ainda não tem uma conta?<br/><NavLink to="/cadastro-usuario">Cadastre-se aqui!</NavLink></p>                        
                    </div>  
                </form> 
            </div>      
        </div>
    );
}

export default Login;