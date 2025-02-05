import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api';
import styles from './styles.module.css';

function EditarImovel() {    

    const [confirmationMessage, setConfirmationMessage] = useState('');          
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    
    const [imovelData, setImovel] = useState(null);
    /*const [tipo, setTipo] = useState('');
    const [finalidade, setFinalidade] = useState('');   */
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
                /*setTipo(response.data.tipo[0]?.tipo.id);
                setFinalidade(response.data.finalidade[0]?.finalidade.id);   */             
                setCurrentPhotos(response.data.fotos || []);
                setLoading(false);
            } catch (error) {
                setError('Erro ao buscar tarefa:', error);
                setLoading(false);
            }
        }                
        fetchImovel();
    }, [id]);

    useEffect(() => {
        console.log(imovelData);
    });

    /*useEffect(() => {
        async function fetchCategorias() {
            try {
                const [tiposResponse, finalidadesResponse] = await Promise.all([
                    api.get('/tipo'),
                    api.get('/finalidade')
                ]);
                setTipo(tiposResponse.data);
                setFinalidade(finalidadesResponse.data);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
                setError('Erro ao carregar categorias');
            }
        }
        fetchCategorias();
    }, []);*/

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
        /*formPayload.append('tipo', tipo);
        formPayload.append('finalidade', finalidade);*/

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
            console.log('Dentro do try:', currentPhotos)
            setConfirmationMessage('Tarefa atualizada com sucesso!');
            setTimeout(() => {
                setConfirmationMessage('');
                navigate('/');
            }, 1000);
            
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
   
  return (
    <>
        <h2 className={styles.pagetitle}>Editar tarefa</h2>  
        <div id="main">
        <div className="container">        
            {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}          

            <form>                
                <div className="form-item">                    
                    <input type="text" name="titulo" className="titulo" value={formData.titulo} onChange={updateFormData} placeholder='Título' /> 
                </div>                                            
                <div className="form-item">                       
                    <textarea name="descricaoLonga" className="descricaoLonga" value={formData.descricaoLonga} onChange={updateFormData} placeholder='Descrição'></textarea>
                </div>  

                 {/*<div className="form-item">
                    <label htmlFor="tipo">Tipo de imóvel</label>
                    <ListaCategorias endpoint="tipo" selectedId={tipo} onChange={setTipo} />
                </div>*/}
                                       
                <div className="form-item">
                    <label htmlFor="subtitulo">Fotos</label>
                    <div className="existing-images">
                            {currentPhotos.map((image, index) => (
                                <div key={index} className={styles.imageitem}>
                                    <img src={`http://localhost:3000/uploads/${image}`} alt={`Imagem ${index + 1}`} />
                                    <button type="button" onClick={() => handleDeleteImage(image)} className={styles.excluir}>Excluir</button>
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