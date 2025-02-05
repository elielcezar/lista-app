import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import styles from './styles.module.css';

export const ListaImoveis = () => {
  
    const [imoveis, setImoveis] = useState([]);

    const navigate = useNavigate();

    /*async function getImoveis(){
        const imoveisFromAPI = await api.get('/imoveis')
        setImoveis(imoveisFromAPI.data);        
    } 
  
    useEffect(() => {
        getImoveis();        
    }, [])*/

    useEffect(() => {
        const fetchImoveis = async () => {
            try {
                const response = await api.get('/imoveis')
                setImoveis(response.data)
            } catch (error) {
                console.error('Erro ao carregar imóveis:', error)
            }
        }
        fetchImoveis()
    }, [])
   
    const baseUrl = 'http://localhost:3000/uploads/'

    const handleClick = (id) => {        
        navigate(`/tarefa/edit/${id}`)
    }
    
    const handleStatusChange = async (e, imovelId) => {
        e.stopPropagation()
        
        try {
            // Adiciona headers à requisição
            const response = await api.patch(`/imoveis/${imovelId}/status`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const updatedImoveis = imoveis.map(imovel => {
                    if (imovel.id === imovelId) {
                        return { ...imovel, status: !imovel.status }
                    }
                    return imovel
                })
                setImoveis(updatedImoveis)
            }
        } catch (error) {
            console.error('Erro detalhado:', error.response?.data || error.message)
        }
    }

  return (    
    <div id="imoveis" className={styles.imoveis}>
        {imoveis.map((imovel) => (
            <div className={styles.item} key={imovel.id}>
                <div className={styles.card}>    
                    <div className={styles.checkbox}>                        
                        <input type="checkbox" checked={Boolean(imovel.status)} onChange={(e) => handleStatusChange(e, imovel.id)} onClick={(e) => e.stopPropagation()} />
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
    </div>       
  )
}

export default ListaImoveis