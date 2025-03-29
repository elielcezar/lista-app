import { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import StatusMessage from '@/components/StatusMessage';
import InlineMessage from '@/components/InlineMessage';
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/logo.webp';
import { FaRegUser } from "react-icons/fa";
import styles from './styles.module.css';

export const Login = () => { 
    const [confirmationMessage, setConfirmationMessage] = useState({ message: '', type: '' });  
    const [inlineMessage, setInlineMessage] = useState({ message: '', type: '' });    
    const inputIdentifier = useRef(null);
    const inputPassword = useRef(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const isFirstLogin = sessionStorage.getItem('isFirstLogin');
        if (isFirstLogin) {
            setInlineMessage({
                message: (
                    <>
                       Obrigado por se cadastrar!<br/>Faça seu login e comece a gerenciar sua lista de tarefas.
                    </>
                ),
                type: 'success'
            });
            sessionStorage.removeItem('isFirstLogin');
        }
        sessionStorage.removeItem('isFirstLogin');
    }, []);

    async function handleLogin(e) {
        e.preventDefault();
        
        try {
            const response = await api.post('/login', {
                identifier: inputIdentifier.current.value,
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
                message: (
                    <>
                    Erro ao fazer login.<br/> Verifique suas credenciais.
                    </>
                ),
                type: 'error'
            });
            setTimeout(() => {
                setConfirmationMessage({
                    message: '',
                    type: ''
                });
            }, 2000);
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
                
                <h1><img src={logo} alt="Task App" /></h1>
                <form onSubmit={handleLogin} className={styles.loginForm}>           
                    <div className="form-item">
                        {inlineMessage.message && (
                            <InlineMessage 
                                message={inlineMessage.message} 
                                type={inlineMessage.type} 
                            />
                        )}
                        <input 
                            type="text" 
                            name="identifier" 
                            className={styles.identifier}
                            placeholder='Email ou Telefone' 
                            ref={inputIdentifier}
                            onKeyPress={handleKeyPress}
                            required 
                        />
                    </div>
                    <div className="form-item">
                        <input 
                            type="password" 
                            name="password" 
                            className={styles.password}
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
                        <p><NavLink to="/esqueci-senha">Esqueceu sua senha?</NavLink></p>
                    </div>  
                </form> 
            </div>      
        </div>
    );
}

export default Login;