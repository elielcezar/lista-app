// front/src/pages/Usuario/EsqueciSenha/index.jsx
import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import api from '@/services/api';
import StatusMessage from '@/components/StatusMessage';
import logo from '@/assets/logo.webp';
import styles from './styles.module.css';

export default function EsqueciSenha() {
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const inputIdentifier = useRef(null);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('entrou no try');
      const response = await api.post('/esqueci-senha', {
        identifier: inputIdentifier.current.value
      });
      console.log('response', response);

      setStatusMessage({
        message: response.data.message,
        type: 'success'
      });

      //console.log('statusMessage', statusMessage);

      setTimeout(() => {
        setStatusMessage({
          message: '',
          type: ''
        });
      }, 3000);
      
      // Limpar campo
      inputIdentifier.current.value = '';
      
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
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h2 className={styles.formTitle}>Recuperação de Senha</h2>
          
          <p className={styles.instructions}>
            Informe seu email ou telefone cadastrado para receber instruções de recuperação de senha.
          </p>
          
          <div className="form-item">
            <input 
              type="text" 
              placeholder="Email ou Telefone" 
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