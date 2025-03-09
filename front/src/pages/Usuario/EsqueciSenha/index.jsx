// front/src/pages/Usuario/EsqueciSenha/index.jsx
import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import StatusMessage from '@/components/StatusMessage';
import { detectarTipoIdentificador } from '@/utils/validation';
import logo from '@/assets/logo.webp';
import styles from './styles.module.css';

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const inputIdentifier = useRef(null);
  
  async function handleSolicitarRecuperacao(e) {
    e.preventDefault();
    setLoading(true);
    
    const identifier = inputIdentifier.current.value;
    
    // Detectar tipo de identificador
    const tipo = detectarTipoIdentificador(identifier);
    
    try {
      const response = await api.post('/esqueci-senha', {
        identifier
      });
      
      setStatusMessage({
        message: response.data.message,
        type: 'success'
      });

      // Redirecionar com base no tipo de identificador
      if (tipo === 'email') {
        setTimeout(() => {
          setStatusMessage({
            message: '',
            type: ''
          });
        }, 2000);

      } else {
        // Para telefone, redirecionar para a página de verificação de código
        // Passando o telefone como parâmetro de estado
        setTimeout(() => {
          navigate('/recuperacao-whatsapp', { 
            state: { 
              telefone: identifier,
              codigoEnviado: true 
            } 
          });
        }, 1500);
      }
      
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      setStatusMessage({
        message: error.response?.data?.error || 'Erro ao processar solicitação',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div id="main" className={styles.mainlogin}>
      <div className={`container ${styles.container}`}>
        {statusMessage.message && (
          <StatusMessage message={statusMessage.message} type={statusMessage.type} />
        )}
        
        <h1><img src={logo} alt="Lista App" /></h1>
        
        <form onSubmit={handleSolicitarRecuperacao} className={styles.loginForm}>
          <h2 className={styles.formTitle}>Recuperação de Senha</h2>
          
          <p className={styles.instructions}>
            Informe seu email ou número de WhatsApp cadastrado para receber instruções de recuperação.
          </p>
          
          <div className="form-item">
            <input 
              type="text" 
              placeholder="Email ou WhatsApp" 
              ref={inputIdentifier} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-item">
            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Recuperar Senha'}
            </button>
          </div>
          
          <div className="extras">
            <p>Lembrou sua senha? <NavLink to="/login">Voltar para Login</NavLink></p>
          </div>
        </form>
      </div>
    </div>
  );
}