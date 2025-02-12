import { useState, useRef, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import StatusMessage from '@/components/StatusMessage';
import api from '@/services/api'
import styles from './styles.module.css';

export const Login = () => { 
    
    const [confirmationMessage, setConfirmationMessage] = useState({ message: '', type: '' });  

    const inputEmail = useRef(null);
    const inputPassword = useRef(null);
    const navigate = useNavigate(null);
    const { login } = useContext(AuthContext);

    async function handleLogin(){

        const email = inputEmail.current.value;
        const password = inputPassword.current.value;
        
        try {
            const response = await api.post('/login', { email, password });            
            const { token } = response.data;
            
            login(token);
            setConfirmationMessage('Login efetuado com sucesso!');            
            navigate('/');

        } catch (error) {
            console.error(error);
            setConfirmationMessage({
              message: 'Erro ao efetuar login.',
              type: 'error'
            });
            setTimeout(() => setConfirmationMessage({ message: '', type: '' }), 2000);
        }
    }

    function handleKeyPress(event){
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
        <form className={styles.loginForm}>           
            <div className="form-item">
                <input type="email" name="email" className="email" placeholder='Email' ref={inputEmail} onKeyPress={handleKeyPress} />
            </div>
            <div className="form-item">
                <input type="password" name="password" className="password" placeholder='Senha' ref={inputPassword} onKeyPress={handleKeyPress} />
            </div>
            <div className="form-item">
                <button type='button' onClick={handleLogin}>Enviar</button>
            </div>
            <div className="extras">
              <p>Ainda não tem uma conta?<br/><NavLink to="/cadastro-usuario">Cadastre-se aqui!</NavLink></p>
              <p><NavLink to="/recuperar-senha">Esqueceu sua senha?</NavLink></p>
            </div>  
        </form> 
        
      </div>      
    </div>
  )
}

export default Login;