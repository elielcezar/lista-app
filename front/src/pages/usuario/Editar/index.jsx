import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PageTitle from '@/components/PageTitle';
import api from "@/services/api";
import StatusMessage from '@/components/StatusMessage';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

export const Usuario = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    
    const inputName = useRef(null);
    const inputEmail = useRef(null);
    const inputPassword = useRef(null);

    useEffect(() => {
        async function loadUsuario() {
            try {
                const response = await api.get(`/usuarios/${id}`);
                setUsuario(response.data);
                setRole(response.data.role);
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
            inputEmail.current.value = usuario.email;
        }
    }, [usuario]);

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const userData = {
                name: inputName.current.value,
                email: inputEmail.current.value,
                role: role
            };

            // Adicionar senha apenas se foi preenchida
            if (inputPassword.current?.value) {
                userData.password = inputPassword.current.value;
            }

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

    if (loading) return <div>Carregando...</div>;
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
                                type="email" 
                                placeholder="E-mail" 
                                ref={inputEmail}
                                required 
                            />
                        </div>
                        
                        <div className="form-item">
                            <input 
                                type="password" 
                                placeholder="Nova Senha (opcional)" 
                                ref={inputPassword}
                            />
                        </div>

                        <div className="form-item">
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