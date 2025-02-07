import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import ListaUsuarios from '../../../components/form-usuarios';
import api from '../../../services/api';
import { FaRegTrashAlt } from "react-icons/fa";
import styles from './styles.module.css';

function EditarImovel() {    

    const [confirmationMessage, setConfirmationMessage] = useState('');          
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    
    const [imovelData, setImovel] = useState(null);
    
    const [usuario, setUsuario] = useState('');
    
    const [currentPhotos, setCurrentPhotos] = useState([]);
    
    const [formData, setFormData] = useState({
        titulo: '',       
        descricaoLonga: '',       
        fotos: ''
    });

    const inputFotos = useRef(null);    
    const { id } = useParams();

    useEffect(() => {
        async function fetchImovel() {
            try {
                const response = await api.get(`/imoveis/id/${id}`);
                setImovel(response.data);
                setFormData({
                    titulo: response.data.titulo,                   
                    descricaoLonga: response.data.descricaoLonga,                    
                    fotos: response.data.fotos
                });                
                
                setUsuario(response.data.usuarios[0]?.user.id);
                
                setCurrentPhotos(response.data.fotos || []);
                setLoading(false);
            } catch (error) {
                setError('Erro ao buscar tarefa:', error);
                setLoading(false);
            }
        }                
        fetchImovel();
    }, [id]);   

    async function handleSubmit(e) {    
        e.preventDefault();

        // Cria o objeto que será enviado sempre via FormData
        // Adiciona todos os campos do formData, exceto 'fotos'
        const formPayload = new FormData();
        Object.keys(formData).forEach((key) => {                
            if (key !== 'fotos') {
            formPayload.append(key, formData[key]);
            }
        });

        // Adiciona os selects
        formPayload.append('usuarios', usuario);        

        // Sempre envia as fotos antigas, mesmo que não haja novos arquivos
        formPayload.append('oldPhotos', JSON.stringify(currentPhotos));

        // Se houver novos arquivos, adiciona-os
        if (inputFotos.current && inputFotos.current.files.length > 0) {
            Array.from(inputFotos.current.files).forEach((file) => {
            formPayload.append('fotos', file);
            });
        }  

        try {
            await api.put(`/imoveis/${id}`, formPayload, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });            
            
            setConfirmationMessage('Tarefa atualizada com sucesso!');

            setTimeout(() => {
                setConfirmationMessage('');
                navigate('/');
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            setConfirmationMessage('Erro ao atualizar tarefa.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }           
    }

    function handleDeleteImage(image) {        
        setCurrentPhotos(currentPhotos.filter(img => img !== image));
        console.log('Fotos atualizadas', currentPhotos)
    }

    const updateFormData = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro ao carregar tarefa: {error.message}</div>;
    if (!imovelData) return <div>Tarefa não encontrada</div>;

    const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';
   
  return (
    <>
        {confirmationMessage ? 
            <div className={styles.overlay}>
                <p className={styles.confirmationmessage}>{confirmationMessage}</p>
            </div> 
        : null}

        <h2 className={styles.pagetitle}>Editar tarefa</h2>  
        <div id="main">
        <div className="container">        
            <form>                
                <div className="form-item">                    
                    <input type="text" name="titulo" className="titulo" value={formData.titulo} onChange={updateFormData} placeholder='Título' /> 
                </div>                                            
                <div className="form-item">                       
                    <textarea name="descricaoLonga" className="descricaoLonga" value={formData.descricaoLonga} onChange={updateFormData} placeholder='Descrição'></textarea>
                </div>  

                <div className="form-item">     
                    <label>Responsável: </label>               
                    <ListaUsuarios selectedId={usuario} onChange={setUsuario} />
                </div>
                                       
                <div className="form-item">
                    <label htmlFor="subtitulo">Fotos</label>
                    <div className={styles.existingimages}>
                            {currentPhotos.map((image, index) => (
                                <div key={index} className={styles.imageitem}>
                                    <img src={`${baseUrl}${image}`} alt={`Imagem ${index + 1}`} />
                                    <button type="button" onClick={() => handleDeleteImage(image)} className={styles.excluir}>
                                        <FaRegTrashAlt />
                                    </button>
                                </div>
                            ))}
                        </div>
                    <input type="file" name="fotos" className="fotos" ref={inputFotos} multiple />
                </div>

                <div className="form-item">
                    <button type='button' onClick={handleSubmit}>Salvar</button>
                </div>

            </form>       
        </div>      
    </div>
    </>    
  )
}

export default EditarImovel