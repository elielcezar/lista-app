import { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StatusMessage from '@/components/StatusMessage';
import InlineMessage from '@/components/InlineMessage';
import CardTarefa from '@/components/CardTarefa';
import api from '@/services/api';
import styles from './styles.module.css';

export default function ListaTarefasGerente({ status }) {
    
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });    
    const [inlineMessage, setInlineMessage] = useState({ message: '', type: '' });    
    const [tarefas, setTarefas] = useState([]);
    const { user } = useAuth();    

    const loadTarefas = async () => {
        try {
            if (!user?.id) {
                console.log('User ID não disponível');
                return;
            }
            
            const response = await api.get('/tarefas', {
                params: {
                    authorId: user.id,
                    status: status
                }
            });                
            
            if (!response.data || response.data.length === 0) {
                setInlineMessage({ 
                    message: (
                        <>
                            Não encontramos nenhuma tarefa por aqui.
                            <NavLink to="/cadastro-tarefa">Aproveite para criar uma.</NavLink>
                        </>
                    ),
                    type: 'message' 
                });
                setTarefas([]);
            } else {
                const filteredTarefas = response.data
                    .filter(tarefa => tarefa.status === (status === 'true' || status === true))
                    .reverse();
                
                setTarefas(filteredTarefas);
                setInlineMessage({ message: '', type: '' });
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
            
            setStatusMessage({ 
                message: 'Erro ao carregar tarefas. Tente novamente.',
                type: 'error' 
            });
            setTarefas([]);
        }
    };

    useEffect(() => {
        if (user?.id) {
            loadTarefas();
        }
    }, [user, status]);
    
    // Função modificada para manipular mudanças de status
    const handleStatusChange = (tarefaId, newStatus) => {
        // Remover o item diretamente (a animação já aconteceu no CardTarefa)
        setTarefas(prevTarefas => 
            prevTarefas.filter(tarefa => tarefa.id !== tarefaId)
        );
        
        // Dar um tempo extra e recarregar a lista
        setTimeout(() => {
            loadTarefas();
        }, 800);
    };

    return (    
        <div id="tarefas" className={styles.tarefas}>
            {statusMessage.message && (
                <StatusMessage message={statusMessage.message} type={statusMessage.type} />
            )}

            {inlineMessage.message && (
                <InlineMessage message={inlineMessage.message} type={inlineMessage.type} />
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