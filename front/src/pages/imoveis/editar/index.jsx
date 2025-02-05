import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ListaCategorias from '../../../components/form-categorias';
import api from '../../../services/api';
import './style.css';

function EditarImovel() {    

    const [confirmationMessage, setConfirmationMessage] = useState('');          
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [imovelData, setImovel] = useState(null);
    const [tipo, setTipo] = useState('');
    const [finalidade, setFinalidade] = useState('');   
    const [currentPhotos, setCurrentPhotos] = useState([]);
    const [formData, setFormData] = useState({
        titulo: '',
        codigo: '',
        subTitulo: '',
        descricaoCurta: '',
        descricaoLonga: '',
        valor: '',
        endereco: '',
        cidade: '',
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
                    subTitulo: response.data.subTitulo,
                    descricaoCurta: response.data.descricaoCurta,
                    descricaoLonga: response.data.descricaoLonga,
                    codigo: response.data.codigo,                    
                    valor: response.data.valor,
                    endereco: response.data.endereco,
                    cidade: response.data.cidade,
                    fotos: response.data.fotos
                });                
                setTipo(response.data.tipo[0]?.tipo.id);
                setFinalidade(response.data.finalidade[0]?.finalidade.id);                
                setCurrentPhotos(response.data.fotos || []);
                setLoading(false);
            } catch (error) {
                setError('Erro ao buscar imóvel:', error);
                setLoading(false);
            }
        }                
        fetchImovel();
    }, [id]);

    useEffect(() => {
        console.log(imovelData);
    });

    useEffect(() => {
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
    }, []);

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
        formPayload.append('tipo', tipo);
        formPayload.append('finalidade', finalidade);

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
            setConfirmationMessage('Imóvel atualizado com sucesso!');
            setTimeout(() => setConfirmationMessage(''), 5000);
        } catch (error) {
            console.error('Erro ao atualizar imóvel:', error);
            setConfirmationMessage('Erro ao atualizar imóvel.');
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
    if (error) return <div>Erro ao carregar imóvel: {error.message}</div>;
    if (!imovelData || !imovelData.tipo || !imovelData.finalidade) return <div>Imóvel não encontrado</div>;
   
  return (
    <div id="main">
        <div className="container">        
            <h1>Editar imóvel</h1>  

            {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}          

            <form>                
                <div className="form-item">
                    <label htmlFor="titulo">Título</label>
                    <input type="text" name="titulo" className="titulo" value={formData.titulo} onChange={updateFormData} />                    
                </div>                             
                <div className="form-item">
                    <label htmlFor="subtitulo">Subtítulo</label>
                    <input type="text" name="subTitulo" className="subTitulo" value={formData.subTitulo} onChange={updateFormData} />
                </div>

                <div className="form-item">
                    <label htmlFor="subtitulo">Descrição curta</label>
                    <input type="text" name="descricaoCurta" className="descricaoCurta" value={formData.descricaoCurta} onChange={updateFormData} />            
                </div>
                <div className="form-item">   
                    <label htmlFor="subtitulo">Descrição longa</label>             
                    <textarea name="descricaoLonga" className="descricaoLonga" value={formData.descricaoLonga} onChange={updateFormData}></textarea>
                </div>               
                <div className="form-item">
                    <label htmlFor="subtitulo">Fotos</label>
                    <div className="existing-images">
                            {currentPhotos.map((image, index) => (
                                <div key={index} className="image-item">
                                    <img src={`http://localhost:3000/uploads/${image}`} alt={`Imagem ${index + 1}`} />
                                    <button type="button" onClick={() => handleDeleteImage(image)}>Excluir</button>
                                </div>
                            ))}
                        </div>
                    <input type="file" name="fotos" className="fotos" ref={inputFotos} multiple />
                </div>
                  
                
                <div className="row">                    
                        
                        <div className="form-item">
                            <label htmlFor="subtitulo">Código de referência</label>
                            <input type="text" name="codigo" className="codigo" value={formData.codigo} onChange={updateFormData} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="tipo">Tipo de imóvel</label>
                            <ListaCategorias endpoint="tipo" selectedId={tipo} onChange={setTipo} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="finalidade">Finalidade</label>
                            <ListaCategorias endpoint="finalidade" selectedId={finalidade} onChange={setFinalidade} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="valor">Valor</label>
                            <input type="text" name="valor" className="valor" value={formData.valor} onChange={updateFormData} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="endereco">Endereço</label>
                            <input type="text" name="endereco" className="endereco" value={formData.endereco} onChange={updateFormData} />
                        </div>
                        <div className="form-item">
                            <label htmlFor="cidade">Cidade</label>
                            <input type="text" name="cidade" className="cidade" value={formData.cidade} onChange={updateFormData} />
                        </div>      
                    
                </div>{/*row*/}

                <div className="form-item">
                    <button type='button' onClick={handleSubmit}>- Enviar -</button>
                </div>

            </form>       
        </div>      
    </div>
  )
}

export default EditarImovel