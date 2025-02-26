import { useState, useEffect } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import StatusMessage from '@/components/StatusMessage';
import InlineMessage from '@/components/InlineMessage';
import ButtonCreate from '@/components/ButtonCreate';
import PageTitle from '@/components/PageTitle';
import api from '@/services/api';
import styles from './styles.module.css';

export const TarefasArquivadas = () => {

    const { user, hasRole } = useAuth();  

    //const [confirmationMessage, setConfirmationMessage] = useState(''); 
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });    
    const [inlineMessage, setInlineMessage] = useState({ message: '', type: '' });    
    const [loading, setLoading] = useState(true);
  
    const [tarefas, setTarefas] = useState([]);
    const navigate = useNavigate();
    //const { user } = useAuth();

    useEffect(() => {
        const fetchTarefas = async () => {
            try {
                const response = await api.get('/tarefas', {
                    params: {
                        authorId: user.id,
                        status: true
                    }
                });

                if (!response.data || response.data.length === 0) {
                    setInlineMessage({ 
                        message: (
                            <>
                                Você não possui tarefas arquivadas no momento.                                
                            </>
                        ),
                        type: 'message' 
                    });
                    console.log('Você não possui tarefas arquivadas no momento.');
                    setTarefas([]);
                } else {
                    setTarefas(response.data);   
                    setInlineMessage({ message: '', type: '' });             
                }
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error);
                 setStatusMessage({ 
                    message: 'Erro ao carregar tarefas. Tente novamente.',
                    type: 'error' 
                });
                setTarefas([]);
                setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
            } finally {
                setLoading(false);
            }
        }
        if (user?.id) {
            fetchTarefas();
        }        
    }, [user])   
    
    const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';


    const handleClick = (id) => {        
        navigate(`/tarefa/edit/${id}`)
    }
    
    const handleStatusChange = async (e, tarefaId) => {
        e.stopPropagation()
        
        try {            
            const tarefa = tarefas.find(im => im.id === tarefaId);

            const response = await api.patch(`/tarefas/${tarefaId}/status`, {
                status: !tarefa.status
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const updatedtarefas = tarefas.map(tarefa => {
                    if (tarefa.id === tarefaId) {
                        return { ...tarefa, status: !tarefa.status };
                    }
                    return tarefa;
                });
                const filteredTarefas = updatedtarefas.filter(item => item.status === true);                

                setTarefas(filteredTarefas);                

                setStatusMessage({ 
                    message: (
                        <>
                            Tarefa reativada com sucesso!
                        </>
                    ),
                    type: 'message' 
                });

                setTimeout( () => {
                    setStatusMessage('');
                }, 1000);
            }
        } catch (error) {
            console.error('Erro detalhado:', error.response?.data || error.message)
        }
    }

  return (    
    <>      
      <PageTitle title="Tarefas Arquivadas"/>
      <div id="main">
        <div id="tarefas" className={styles.tarefas}>
        
        <div className="container">           

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
                                    <strong>Responsável:</strong> {tarefa.user.name}
                                </p>
                            )}            
                            
                        </div>   
                        <div className={styles.capa} onClick={() => handleClick(tarefa.id)}>                        
                            <img src={`${baseUrl}${tarefa.imagemDepois}`} alt="" />                                                              
                        </div>                                   
                    </div>                
                </div>
            ))}
        </div>

        {hasRole(['gerente', 'admin']) && (            
            <ButtonCreate path="/cadastro-tarefa"/>
        )}    
    </div>  
    </div>
    </>
  )
}

export default TarefasArquivadas