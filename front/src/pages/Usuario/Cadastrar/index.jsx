import { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import PageTitle from '@/components/PageTitle';
import FormTitle from '@/components/FormTitle';
import api from '@/services/api'
import StatusMessage from '@/components/StatusMessage';
import { useAuth } from '@/context/AuthContext';
import { validarIdentificador, detectarTipoIdentificador, prepararIdentificador } from '@/utils/validation';
import logo from '@/assets/logo.webp';
import styles from './styles.module.css';

function CadastroUsuario() {

    const navigate = useNavigate();

    const { isAuthenticated, user } = useAuth();

    const { hasRole } = useAuth();
    
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
    const [validationError, setValidationError] = useState('');
    
    const inputName = useRef(null);
    const inputIdentifier = useRef(null);
    const inputPassword = useRef(null);
    const [role, setRole] = useState(null);    

    useEffect(() => {
        if (isAuthenticated) {
            setRole('colaborador');
        } else {
            setRole('gerente');
        }
    }, [isAuthenticated]);
    
    // Validar o identificador quando o campo perder o foco
    const handleIdentifierBlur = () => {
        const identifier = inputIdentifier.current.value;
        
        if (!identifier) {
            setValidationError('');
            return;
        }
        
        if (!validarIdentificador(identifier)) {
            const tipo = detectarTipoIdentificador(identifier);
            setValidationError(tipo === 'email' 
                ? 'Email inválido. Use um formato válido (ex: nome@empresa.com.br)' 
                : 'Informe o telefone completo, com DDD. Por exemplo: 11 5555-9999');
        } else {
            setValidationError('');
        }
    };
    
    async function handleSubmit(e) {
        e.preventDefault();
        
        const identifier = inputIdentifier.current.value;
        
        // Validar o identificador antes de enviar
        if (!validarIdentificador(identifier)) {
            const tipo = detectarTipoIdentificador(identifier);
            setValidationError(tipo === 'email' 
                ? 'Email inválido. Use um formato válido (ex: nome@dominio.com)' 
                : 'Informe o telefone completo, com DDD. Por exemplo: 11 5555-9999');
            return;
        }
        
        try {
            // Preparar o identificador (limpar telefone ou formatar email)
            const preparedIdentifier = prepararIdentificador(identifier);
            
            const userData = {
                name: inputName.current.value,
                identifier: preparedIdentifier,
                password: inputPassword.current.value,
                role: role,
                createdBy: isAuthenticated ? user.id : null
            };

            const response = await api.post('/usuarios', userData);

            if (response.status === 201) {                
                sessionStorage.setItem('isFirstLogin', 'true');
                setTimeout(() => navigate('/usuarios'), 1000);
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            setStatusMessage({
                message: error.response?.data?.error || 'Erro ao cadastrar usuário. Tente novamente.',
                type: 'error'
            });
            setTimeout(() => {
                setStatusMessage({
                  message: '',
                  type: ''
                });
              }, 3000);
        }
    }

    return (
        <>        
            {isAuthenticated ? (
                <PageTitle title="Cadastrar Colaborador" />
            ) : null}            
            
            <div id="main" className={styles.mainlogin}>
                <div className={`container ${styles.container}`}>    
                    {statusMessage.message && (
                        <StatusMessage message={statusMessage.message} type={statusMessage.type} />
                    )}

                    {!isAuthenticated ? (
                        <h1><img src={logo} alt="Task App" /></h1>
                    ) : null}                     
                             
                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        {!isAuthenticated && (
                            <FormTitle title="Cadastre-se" />
                        )}

                        <div className="form-item">
                            <input type="text" placeholder="Nome" ref={inputName} required />
                        </div>
                        
                        <div className="form-item">
                            <input 
                                type="text" 
                                placeholder="Email ou Telefone" 
                                ref={inputIdentifier} 
                                onBlur={handleIdentifierBlur}
                                required 
                            />
                            {validationError && (
                                <div className={styles.errorMessage}>{validationError}</div>
                            )}
                        </div>
                        
                        <div className="form-item">
                            <input type="password" placeholder="Senha" ref={inputPassword} required />
                        </div>

                        <div className={`form-item ${styles.tipoUsuario}`}>
                            <label>Tipo de Usuário:</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value="colaborador">Colaborador</option>
                                <option value="gerente">Gerente</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        
                        <div className="form-item">
                            <button type="submit">Cadastrar Usuário</button>
                        </div>

                        {!isAuthenticated && (
                            <div className="extras">
                                <p>Já possui uma conta? <NavLink to="/login">Faça login</NavLink></p>
                            </div>
                        )}
                    </form>
                </div>
            </div>        
        </>
    );
}

export default CadastroUsuario