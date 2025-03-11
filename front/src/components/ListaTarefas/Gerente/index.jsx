import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import StatusMessage from '@/components/StatusMessage';
import InlineMessage from '@/components/InlineMessage';
import CardTarefa from '@/components/CardTarefa';
import api from '@/services/api';
import styles from './styles.module.css';

export default function ListaTarefasGerente({ status }) {
    
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });    
    const [inlineMessage, setInlineMessage] = useState({ message: '', type: '' });    
    const [loading, setLoading] = useState(true);
  
    const [tarefas, setTarefas] = useState([]);
    //const navigate = useNavigate();
    const { user } = useAuth();    

    const loadTarefas = async () => {
        try {
            console.log('Iniciando carregamento de tarefas');
            console.log('User ID:', user?.id);
            
            const response = await api.get('/tarefas', {
                params: {
                    authorId: user.id,
                    status: status
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
    };

    useEffect(() => {
        if (user?.id) {
            loadTarefas();
        } else {
            console.log('Usuário não definido ainda');
        }
    }, [user]);
    
    //const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';    

    // Adicionar função para manipular mudanças de status
    const handleStatusChange = (tarefaId, newStatus) => {
        setTarefas(prevTarefas => 
            prevTarefas.map(tarefa => 
                tarefa.id === tarefaId 
                    ? { ...tarefa, status: newStatus } 
                    : tarefa
            )
        );
        
        // Se a tarefa for marcada como concluída, remova-a da lista após delay
        if (newStatus) {
            setTimeout(() => {
                setTarefas(prevTarefas => 
                    prevTarefas.filter(tarefa => tarefa.id !== tarefaId)
                );
            }, 500);
        }
        
        // Opcionalmente, recarregar todas as tarefas após um delay
        setTimeout(() => {
            loadTarefas();
        }, 1000);
    };

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
            <CardTarefa 
                key={tarefa.id} 
                tarefa={tarefa} 
                onStatusChange={handleStatusChange} 
            />
        ))}
    </div>       
  )
}