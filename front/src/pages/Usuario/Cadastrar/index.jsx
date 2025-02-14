import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import PageTitle from '@/components/PageTitle';
import api from '@/services/api'
import StatusMessage from '@/components/StatusMessage';
import { useAuth } from '@/context/AuthContext';
import styles from './styles.module.css';

function CadastroUsuario() {

    const navigate = useNavigate();

    const { isAuthenticated, user } = useAuth();
    
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
    
    const inputName = useRef(null);
    const inputEmail = useRef(null);
    const inputPassword = useRef(null);
    const [role, setRole] = useState(null);    

    useEffect(() => {
        if (isAuthenticated) {
            setRole('colaborador');
        } else {
            setRole('gerente');
        }
    }, [isAuthenticated]);
    
    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const userData = {
                name: inputName.current.value,
                email: inputEmail.current.value,
                password: inputPassword.current.value,
                role: role,
                createdBy: isAuthenticated ? user.id : null
            };

            console.log(userData);

            const response = await api.post('/usuarios', userData);

            if (response.status === 201) {
                setStatusMessage({
                    message: 'Usuário cadastrado com sucesso!',
                    type: 'success'
                });
                setTimeout(() => navigate('/usuarios'), 1000);
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            setStatusMessage({
                message: 'Erro ao cadastrar usuário. Tente novamente.',
                type: 'error'
            });
        }
    }

    return (
        <>
            {isAuthenticated ? (
                <PageTitle title="Cadastrar Colaborador" />
            ) : null}            
            
            <div id="main">
                <div className="container">
                    {statusMessage.message && (
                        <StatusMessage message={statusMessage.message} type={statusMessage.type} />
                    )}

                    <form onSubmit={handleSubmit}>
                        {!isAuthenticated && (
                            <h2 className={styles.formTitle}>Cadastre-se</h2>
                        )}

                        <div className="form-item">
                            <input type="text" placeholder="Nome" ref={inputName} required />
                        </div>
                        
                        <div className="form-item">
                            <input type="email" placeholder="E-mail" ref={inputEmail} required />
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