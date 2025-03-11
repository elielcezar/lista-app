import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import StatusMessage from '@/components/StatusMessage';
import api from '@/services/api';
import styles from './styles.module.css';

export default function CardTarefa({ tarefa, onStatusChange }) {
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });        
    const navigate = useNavigate();

    const handleClick = (id) => {        
        navigate(`/tarefa/edit/${id}`)
    }
    
    const handleStatusChange = async (e, tarefaId) => {
        e.stopPropagation();
        
        try {            
            const currentStatus = tarefa.status;
            
            const card = e.target.closest(`.${styles.card}`);
            if (card) {
                card.classList.add(styles.finished);
            }

            const response = await api.patch(`/tarefas/${tarefaId}/status`, {
                status: !currentStatus
            });           

            console.log('Resposta da API:', response);
            
            if (response.status === 200) {
                if (onStatusChange) {                    
                    onStatusChange(tarefaId, !currentStatus);                    
                }
            }
        } catch (error) {
            console.error('Erro detalhado:', error.response?.data || error.message);
            setStatusMessage({ 
                message: 'Erro ao atualizar status da tarefa.',
                type: 'error' 
            });
        }
    }

    const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';

    return (
        <>
            {statusMessage.message && (
                <StatusMessage message={statusMessage.message} type={statusMessage.type} />
            )}
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
                        <img src={tarefa.imagemAntes ? `${baseUrl}${tarefa.imagemAntes}` : ''} alt="" />                                                              
                    </div>
                </div>                
            </div>
        </>
    )
}
