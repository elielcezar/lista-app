import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import CriarTarefaBtn from '@/components/CriarTarefaBtn';
import PageTitle from '../../components/PageTitle';
import api from '@/services/api';
import styles from './styles.module.css';

export const TarefasArquivadas = () => {

    const [confirmationMessage, setConfirmationMessage] = useState(''); 
    const [loading, setLoading] = useState(true);
  
    const [imoveis, setImoveis] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchImoveis = async () => {
            try {
                const response = await api.get('/imoveis');
                const filteredImoveis = response.data.filter(item => item.status === true);
                setImoveis(filteredImoveis)                
            } catch (error) {
                console.error('Erro ao carregar imóveis:', error)
            }
        }
        fetchImoveis()
    }, [])
   
    //const baseUrl = 'http://localhost:3000/uploads/'
    const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';


    const handleClick = (id) => {        
        navigate(`/tarefa/edit/${id}`)
    }
    
    const handleStatusChange = async (e, imovelId) => {
        e.stopPropagation()
        
        try {            
            const imovel = imoveis.find(im => im.id === imovelId);

           /* setTimeout( () => {
                setConfirmationMessage('');
            }, 1000);*/

            const response = await api.patch(`/imoveis/${imovelId}/status`, {
                status: !imovel.status
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const updatedImoveis = imoveis.map(imovel => {
                    if (imovel.id === imovelId) {
                        return { ...imovel, status: !imovel.status };
                    }
                    return imovel;
                });
                const filteredImoveis = updatedImoveis.filter(item => item.status === true);                

                setImoveis(filteredImoveis);                

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
    <div id="imoveis" className={styles.imoveis}>
        
        <PageTitle title="Tarefas Arquivadas"/>
        
        {confirmationMessage ? 
            <div className={styles.overlay}>
                <p className={styles.confirmationmessage}>{confirmationMessage}</p>
            </div> 
        : null}

        {imoveis.map((imovel) => (
            <div className={styles.item} key={imovel.id}>
                <div className={styles.card}>    
                    <div className={`${styles.checkbox} ${imovel.status ? styles.active : ''}`} onClick={(e) => handleStatusChange(e, imovel.id)} >
                        <input type="checkbox" 
                            //checked={imovel.status} 
                            //onChange={(e) => handleStatusChange(e, imovel.id)} 
                            //onClick={(e) => e.stopPropagation()}                            
                        />
                    </div>
                    <div className={styles.content} onClick={() => handleClick(imovel.id)}>
                        <h3>{imovel.titulo}</h3>
                        <p className={styles.subtitulo}>{imovel.descricaoLonga}</p>                        
                    </div>
                    <div className={styles.capa} onClick={() => handleClick(imovel.id)}>                        
                        <img src={`${baseUrl}${imovel.fotos[0]}`} alt="" />                                                              
                    </div>
                </div>                
            </div>
        ))}
        <CriarTarefaBtn/>  
    </div>       
  )
}

export default TarefasArquivadas