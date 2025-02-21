import { useState, useEffect } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import StatusMessage from '@/components/StatusMessage';
import InlineMessage from '@/components/InlineMessage';
import api from '@/services/api';
import styles from './styles.module.css';

export default function ListaTarefasGerente() {
    
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });    
    const [inlineMessage, setInlineMessage] = useState({ message: '', type: '' });    
    const [loading, setLoading] = useState(true);
  
    const [tarefas, setTarefas] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();    

    useEffect(() => {
        async function loadTarefas() {
            try {
                console.log('Iniciando carregamento de tarefas');
                console.log('User ID:', user?.id);
                
                const response = await api.get('/tarefas', {
                    params: {
                        authorId: user.id,
                        status: false
                    }
                });                
                
                console.log('Resposta da API:', response);
                console.log('Status da resposta:', response.status);
                console.log('Dados recebidos:', response.data);
                
                if (!response.data || response.data.length === 0) {
                    console.log('Tudo feito! Não existem tarefas pendentes para a sua equipe no momento.');
                    setInlineMessage({ 
                        message: (
                            <>
                                Não existem tarefas pendentes para a sua equipe no momento.
                                <NavLink to="/cadastro-tarefa">Aproveite para criar uma.</NavLink>
                            </>
                        ),
                        type: 'message' 
                    });
                    setTarefas([]);
                } else {
                    const filteredTarefas = response.data.reverse();
                    console.log('Tarefas filtradas:', filteredTarefas);
                    setTarefas(filteredTarefas);
                    setInlineMessage({ message: '', type: '' });
                }
                
            } catch (error) {
                console.error('Erro completo:', error);
                console.error('Resposta de erro:', error.response);
                console.error('Detalhes do erro:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                
                setStatusMessage({ 
                    message: 'Erro ao carregar tarefas. Tente novamente.',
                    type: 'error' 
                });
                setTarefas([]);
            } finally {
                setLoading(false);
            }
        }

        if (user?.id) {
            loadTarefas();
        } else {
            console.log('Usuário não definido ainda');
        }
    }, [user]);
    
    const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';

    const handleClick = (id) => {        
        navigate(`/tarefa/edit/${id}`)
    }
    
    const handleStatusChange = async (e, tarefaId) => {
        e.stopPropagation()
        
        try {            
            const tarefa = tarefas.find(im => im.id === tarefaId);

            const card = e.target.closest(`.${styles.card}`);
            if (card) {
                card.classList.add(styles.finished);
            }

            const response = await api.patch(`/tarefas/${tarefaId}/status`, {
                status: !tarefa.status
            });           

            if (response.status === 200) {
                setTimeout(() => {
                    loadTarefas();
                }, 250);
            }
        } catch (error) {
            console.error('Erro detalhado:', error.response?.data || error.message);
            setStatusMessage({ 
                message: 'Erro ao atualizar status da tarefa.',
                type: 'error' 
            });
        }
    }

  return (    
    <div id="tarefas" className={styles.tarefas}>

        {statusMessage.message && (
            <StatusMessage message={statusMessage.message} type={statusMessage.type} />
        )}

        {inlineMessage.message && (
            <InlineMessage message={inlineMessage.message} type={inlineMessage.type} />
        )}

        {loading && (
            <Loading />
        )}

        {tarefas.map((tarefa) => (
            <div className={styles.item} key={tarefa.id}>
                <div className={styles.card}>    
                    <div className={`${styles.checkbox} ${tarefa.status ? styles.active : ''}`} onClick={(e) => handleStatusChange(e, tarefa.id)} >
                        <input type="checkbox" />
                    </div>
                    <div className={styles.content} onClick={() => handleClick(tarefa.id)}>
                        <h3>{tarefa.titulo}</h3>
                        
                        {tarefa.user && (
                            <p className={styles.responsavel}>
                                Responsável: {tarefa.user.name}
                            </p>
                        )}
                                         
                        <p className={styles.subtitulo}>{tarefa.descricao}</p>
                    </div>
                    <div className={styles.capa} onClick={() => handleClick(tarefa.id)}>                        
                        <img src={`${baseUrl}${tarefa.imagemAntes}`} alt="" />                                                              
                    </div>
                </div>                
            </div>
        ))}
    </div>       
  )
}