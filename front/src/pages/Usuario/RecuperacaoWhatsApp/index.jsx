import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import StatusMessage from '@/components/StatusMessage';
import api from '@/services/api';
import FormTitle from '@/components/FormTitle';
import logo from '@/assets/logo.webp';
import styles from './styles.module.css';

export default function RecuperacaoWhatsApp() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar se recebemos estado da página anterior
  const estadoRecebido = location.state || {};
  const telefoneRecebido = estadoRecebido.telefone || '';
  const codigoJaEnviado = estadoRecebido.codigoEnviado || false;
  
  const [step, setStep] = useState(codigoJaEnviado ? 2 : 1); // Começar no passo 2 se o código já foi enviado
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  
  const inputTelefone = useRef(null);
  const inputCodigo = useRef(null);
  const inputNovaSenha = useRef(null);
  const inputConfirmarSenha = useRef(null);
  
  // Armazenar telefone para o passo 2
  const [telefone, setTelefone] = useState(telefoneRecebido);
  
  // Definir o valor inicial do campo de telefone quando o componente montar
  useEffect(() => {
    if (inputTelefone.current && telefoneRecebido) {
      inputTelefone.current.value = telefoneRecebido;
    }    
   
  }, [telefoneRecebido, codigoJaEnviado]);
  
  async function handleSolicitarCodigo(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/esqueci-senha', {
        identifier: inputTelefone.current.value
      });
      
      // Armazenar telefone para o próximo passo
      setTelefone(inputTelefone.current.value);
      
      // Avançar para o próximo passo
      setStep(2);
      
    } catch (error) {
      console.error('Erro ao solicitar código:', error);
      setStatusMessage({
        message: error.response?.data?.error || 'Erro ao processar solicitação',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function handleVerificarCodigo(e) {
    e.preventDefault();
    
    const codigo = inputCodigo.current.value;
    const novaSenha = inputNovaSenha.current.value;
    const confirmarSenha = inputConfirmarSenha.current.value;
    
    // Validar senhas
    if (novaSenha.length < 6) {
      setStatusMessage({
        message: 'A senha deve ter pelo menos 6 caracteres',
        type: 'error'
      });
      setTimeout(() => {
        setStatusMessage({
          message: '',
          type: ''
        });
      }, 3000);
      return;      
    }
    
    if (novaSenha !== confirmarSenha) {
      setStatusMessage({
        message: 'As senhas não coincidem',
        type: 'error'
      });
      setTimeout(() => {
        setStatusMessage({
          message: '',
          type: ''
        });
      }, 3000);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/verificar-codigo', {
        identifier: telefone,
        codigo,
        novaSenha
      });
      
      setStatusMessage({
        message: response.data.message || 'Senha redefinida com sucesso!',
        type: 'success'
      });
      
      // Limpar campos
      inputCodigo.current.value = '';
      inputNovaSenha.current.value = '';
      inputConfirmarSenha.current.value = '';
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      setStatusMessage({
        message: error.response?.data?.error || 'Erro ao verificar código',
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
        
        {step === 1 ? (
          <form onSubmit={handleSolicitarCodigo} className={styles.loginForm}>
            
            <FormTitle title="Recuperação via WhatsApp" />
            
            <p className={styles.instructions}>
              Informe seu número de WhatsApp cadastrado para receber um código de recuperação.
            </p>
            
            <div className="form-item">
              <input 
                type="tel" 
                placeholder="WhatsApp com DDD (ex: 11999999999)" 
                ref={inputTelefone} 
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-item">
              <button type="submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Receber Código'}
              </button>
            </div>
            
            <div className="extras">
              <p><NavLink to="/esqueci-senha">Recuperar por Email</NavLink></p>
              <p><NavLink to="/login">Voltar para Login</NavLink></p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerificarCodigo} className={styles.loginForm}>
            
            <FormTitle title="Verificar Código" />
            
            <p className={styles.instructions}>
              Digite o código de 6 dígitos enviado para seu WhatsApp e defina uma nova senha.
            </p>
            
            <div className="form-item">
              <input 
                type="text" 
                placeholder="Código de 6 dígitos" 
                ref={inputCodigo} 
                required 
                disabled={loading}
                maxLength={6}
                pattern="\d{6}"
              />
            </div>
            
            <div className="form-item">
              <input 
                type="password" 
                placeholder="Nova Senha" 
                ref={inputNovaSenha} 
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-item">
              <input 
                type="password" 
                placeholder="Confirmar Nova Senha" 
                ref={inputConfirmarSenha} 
                required 
                disabled={loading}
              />
            </div>
            
            <div className="form-item">
              <button type="submit" disabled={loading}>
                {loading ? 'Processando...' : 'Redefinir Senha'}
              </button>
            </div>
            
            <div className="extras">
              <p><a href="#" onClick={(e) => { e.preventDefault(); setStep(1); }}>Reenviar código</a></p>
              <p><NavLink to="/esqueci-senha">Recuperar por Email</NavLink></p>
              <p><NavLink to="/login">Voltar para Login</NavLink></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}