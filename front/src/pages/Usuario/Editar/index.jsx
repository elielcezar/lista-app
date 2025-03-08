import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '@/components/PageTitle';
import api from "@/services/api";
import { validarIdentificador, detectarTipoIdentificador, prepararIdentificador } from '@/utils/validation';
import StatusMessage from '@/components/StatusMessage';
import Loading from '@/components/Loading';
import styles from './styles.module.css';

export const Usuario = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
    const [validationError, setValidationError] = useState('');
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    
    const inputName = useRef(null);
    const inputIdentifier = useRef(null);
    const inputPassword = useRef(null);

    useEffect(() => {
        async function loadUsuario() {
            try {
                const response = await api.get(`/usuarios/${id}`);
                setUsuario(response.data);
                setRole(response.data.role || 'colaborador');
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
                setLoading(false);
            }
        }
        
        loadUsuario();
    }, [id]);

    useEffect(() => {
        if (usuario) {
            inputName.current.value = usuario.name;
            inputIdentifier.current.value = usuario.identifier;
        }
    }, [usuario]);

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
                role: role
            };

            // Adicionar senha apenas se foi preenchida
            if (inputPassword.current?.value) {
                userData.password = inputPassword.current.value;
            }

            console.log('Enviando dados:', userData);

            const response = await api.put(`/usuarios/${id}`, userData);

            if (response.status === 200) {
                setStatusMessage({
                    message: 'Usuário atualizado com sucesso!',
                    type: 'success'
                });
                setTimeout(() => navigate('/usuarios'), 2000);
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            setStatusMessage({
                message: 'Erro ao atualizar usuário. Tente novamente.',
                type: 'error'
            });
        }
    }

    if (loading) return <Loading />;
    if (!usuario) return <div>Usuário não encontrado</div>;

    return (
        <>
            <PageTitle title="Editar Usuário" />
            
            <div id="main">
                <div className="container">
                    {statusMessage.message && (
                        <StatusMessage 
                            message={statusMessage.message} 
                            type={statusMessage.type} 
                        />
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-item">
                            <input 
                                type="text" 
                                placeholder="Nome" 
                                ref={inputName}
                                required 
                            />
                        </div>
                        
                        <div className="form-item">
                            <input 
                                type="text" 
                                placeholder="E-mail ou Telefone" 
                                ref={inputIdentifier}
                                onBlur={handleIdentifierBlur}
                                required 
                            />
                            {validationError && (
                                <div className={styles.errorMessage}>{validationError}</div>
                            )}
                        </div>
                        
                        <div className="form-item">
                            <input 
                                type="password" 
                                placeholder="Nova Senha (opcional)" 
                                ref={inputPassword}
                            />
                        </div>

                        <div className={`form-item ${styles.tipoUsuario}`}>
                            <label>Tipo de Usuário:</label>
                            <select 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >                                
                                <option value="colaborador">Colaborador</option>
                                <option value="gerente">Gerente</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        
                        <div className="form-item">
                            <button type="submit">Atualizar Usuário</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Usuario