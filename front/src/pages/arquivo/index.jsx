import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CriarTarefaBtn from '@/components/CriarTarefaBtn';
import PageTitle from '../../components/PageTitle';
import api from '@/services/api';
import styles from './styles.module.css';

export const TarefasArquivadas = () => {

    const [confirmationMessage, setConfirmationMessage] = useState(''); 

    const [loading, setLoading] = useState(true);
  
    const [tarefas, setTarefas] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTarefas = async () => {
            try {
                const response = await api.get('/tarefas');
                const filteredTarefas = response.data.filter(item => item.status === true);
                setTarefas(filteredTarefas)                
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error)
            }
        }
        fetchTarefas()
    }, [])   
    
    const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';


    const handleClick = (id) => {        
        navigate(`/tarefa/edit/${id}`)
    }
    
    const handleStatusChange = async (e, tarefaId) => {
        e.stopPropagation()
        
        try {            
            const tarefa = tarefas.find(im => im.id === tarefaId);

           /* setTimeout( () => {
                setConfirmationMessage('');
            }, 1000);*/

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

                setConfirmationMessage('Tarefa reativada com sucesso!');
                setTimeout( () => {
                    setConfirmationMessage('');
                }, 2000);
            }
        } catch (error) {
            console.error('Erro detalhado:', error.response?.data || error.message)
        }
    }

  return (    
    <div id="tarefas" className={styles.tarefas}>
        
        {confirmationMessage ? 
            <div className={styles.overlay}>
                <p className={styles.confirmationmessage}>{confirmationMessage}</p>
            </div> 
        : null}

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
                                         
                        <p className={styles.subtitulo}>{tarefa.descricao}</p>
                    </div>
                    {/*<div className={styles.capa} onClick={() => handleClick(tarefa.id)}>                        
                        <img src={`${baseUrl}${tarefa.fotos[0]}`} alt="" />                                                              
                    </div>*/}
                </div>                
            </div>
        ))}

        <CriarTarefaBtn/>  
    </div>  
  )
}

export default TarefasArquivadas