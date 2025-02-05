import { useState, useEffect } from "react";
import api from '@/services/api'
import styles from './styles.module.css'

export const ListaImoveis = () => {
  
    const [imoveis, setImoveis] = useState([]);

    async function getImoveis(){
        const imoveisFromAPI = await api.get('/imoveis')
        setImoveis(imoveisFromAPI.data);        
    } 
  
    useEffect(() => {
        getImoveis();        
    }, [])

    useEffect(() => {        
        console.log('Imoveis:', imoveis)
    }, [imoveis])  

  return (    
    <div id="imoveis" className={styles.imoveis}>
        {imoveis.map((imovel) => (
            <div className={styles.item} key={imovel.id}>
                <div className={styles.card}>                   

                    <div className={styles.content}>
                        <h3>{imovel.titulo}</h3>
                        <p className={styles.subtitulo}>{imovel.descricaoLonga}</p>                        
                    </div>
                </div>                
            </div>
        ))}
    </div>       
  )
}

export default ListaImoveis