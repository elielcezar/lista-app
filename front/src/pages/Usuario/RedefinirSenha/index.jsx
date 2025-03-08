// front/src/pages/Usuario/RedefinirSenha/index.jsx
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import api from '@/services/api';
import StatusMessage from '@/components/StatusMessage';
import logo from '@/assets/logo.webp';
import styles from './styles.module.css';

export default function RedefinirSenha() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  
  const inputPassword = useRef(null);
  const inputConfirmPassword = useRef(null);
  
  // Validar token ao carregar a página
  useEffect(() => {
    async function validarToken() {
      try {
        await api.get(`/validar-token/${token}`);
        setTokenValid(true);
      } catch (error) {
        setStatusMessage({
          message: 'Link inválido ou expirado. Solicite um novo link de recuperação.',
          type: 'error'
        });
      } finally {
        setValidatingToken(false);
      }
    }
    
    validarToken();
  }, [token]);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const password = inputPassword.current.value;
    const confirmPassword = inputConfirmPassword.current.value;
    
    // Validar senhas
    if (password.length < 6) {
      setStatusMessage({
        message: 'A senha deve ter pelo menos 6 caracteres',
        type: 'error'
      });
      return;
    }
    
    if (password !== confirmPassword) {
      setStatusMessage({
        message: 'As senhas não coincidem',
        type: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/redefinir-senha', {
        token,
        password
      });
      
      setStatusMessage({
        message: 'Senha redefinida com sucesso!',
        type: 'success'
      });
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setStatusMessage({
        message: error.response?.data?.error || 'Erro ao redefinir senha',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }
  
  if (validatingToken) {
    return (
      <div id="main" className={styles.mainlogin}>
        <div className={`container ${styles.container}`}>
          <h1><img src={logo} alt="Lista App" /></h1>
          <div className={styles.loading}>Verificando link...</div>
        </div>
      </div>
    );
  }
  
  if (!tokenValid) {
    return (
      <div id="main" className={styles.mainlogin}>
        <div className={`container ${styles.container}`}>
          {statusMessage.message && (
            <StatusMessage message={statusMessage.message} type={statusMessage.type} />
          )}
          <h1><img src={logo} alt="Lista App" /></h1>
          <div className={styles.invalidToken}>
            <p>Este link de recuperação é inválido ou expirou.</p>
            <NavLink to="/esqueci-senha" className={styles.newLinkButton}>
              Solicitar Novo Link
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div id="main" className={styles.mainlogin}>
      <div className={`container ${styles.container}`}>
        {statusMessage.message && (
          <StatusMessage message={statusMessage.message} type={statusMessage.type} />
        )}
        
        <h1><img src={logo} alt="Lista App" /></h1>
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2 className={styles.formTitle}>Redefinir Senha</h2>
          
          <div className="form-item">
            <input 
              type="password" 
              placeholder="Nova Senha" 
              ref={inputPassword} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-item">
            <input 
              type="password" 
              placeholder="Confirmar Nova Senha" 
              ref={inputConfirmPassword} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-item">
            <button type="submit" disabled={loading}>
              {loading ? 'Processando...' : 'Redefinir Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}