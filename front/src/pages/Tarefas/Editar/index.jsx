import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FaTrash } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import api from '@/services/api';
import StatusMessage from '@/components/StatusMessage';
import PageTitle from '@/components/PageTitle';
import Loading from '@/components/Loading';

import styles from './styles.module.css';

function EditarTarefa() {

    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });

    const { hasRole } = useAuth();

    const [previewImages, setPreviewImages] = useState({
        imagemAntes: null,
        imagemDepois: null
    });

    const [tarefa, setTarefa] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const inputTitulo = useRef(null);
    const inputDescricao = useRef(null);
    const inputObservacoes = useRef(null);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [status, setStatus] = useState(false);

    useEffect(() => {
        async function loadUsuarios() {
            try {
                const response = await api.get(`/usuarios?createdBy=${user.id}`);
                setUsuarios(response.data);                
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
            }
        }
        loadUsuarios();
    }, [user]);

    useEffect(() => {
        async function loadTarefa() {
            try {
                console.log('carregar tarefa', id);
                
                const response = await api.get(`/tarefas/id/${id}`);
                setTarefa(response.data);
                setSelectedUser(response.data.user?.id.toString() || '');
                setStatus(response.data.status);
                
                // Carregar imagens existentes no preview
                const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';
                setPreviewImages({
                    imagemAntes: response.data.imagemAntes ? `${baseUrl}${response.data.imagemAntes}` : null,
                    imagemDepois: response.data.imagemDepois ? `${baseUrl}${response.data.imagemDepois}` : null
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar tarefa:', error);
                setStatusMessage({
                    message: 'Erro ao carregar dados da tarefa',
                    type: 'error'
                });
                setLoading(false);
            }
        }
        loadTarefa();
    }, [id]);   

    useEffect(() => {
        if (tarefa && inputTitulo.current && inputDescricao.current && inputObservacoes.current) {
            inputTitulo.current.value = tarefa.titulo;
            inputDescricao.current.value = tarefa.descricao || '';
            inputObservacoes.current.value = tarefa.observacoes || '';
        }
    }, [tarefa]);

    async function handleImageUpload(e, imageType) {
        const file = e.target.files[0];
        if (!file) return;

        // Criar preview da imagem
        const imageUrl = URL.createObjectURL(file);
        setPreviewImages(prev => ({
            ...prev,
            [imageType]: imageUrl
        }));
    }

    function handleDeleteImage(imageType) {
        setPreviewImages(prev => ({
            ...prev,
            [imageType]: null
        }));
    }

    function askDelete(){
        setStatusMessage({
            message: (
                <>
                    <span>Tem certeza que deseja excluir essa tarefa? Essa ação não poderá ser desfeita.</span>
                    <button onClick={() => handleDeleteTask(tarefa.id)} className="deleteButton">Sim, pode excluir</button>
                    <button onClick={() => setStatusMessage({ message: '', type: '' })} className="cancelButton">Cancelar</button>
                </>
            ),
            type: 'error' 
        });
    }
   
    async function handleDeleteTask(id) {      
        console.log('deletar tarefa', id);   
        try {
            const response = await api.delete(`/tarefas/${id}`);  
            
            if (response.status === 200) {                
                navigate('/');     
                setTimeout(() => {                
                    setStatusMessage({ 
                        message: (
                            <>
                                Tarrefa excluída com sucesso.
                            </>
                        ),
                        type: 'success' 
                    });      
                }, 250);           
                setTimeout(() => {                
                    setStatusMessage({ message: '', type: '' });                
                }, 2500);           
            } 
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            setStatusMessage({ 
                message: 'Erro ao excluir tarefa. Tente novamente.',
                type: 'error' 
            });
            setTimeout(() => {                
                setStatusMessage({ message: '', type: '' });                
            }, 2000);   
        }
      }
    

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            
            formData.append('titulo', inputTitulo.current.value);
            formData.append('descricao', inputDescricao.current.value);
            formData.append('observacoes', inputObservacoes.current.value);
            formData.append('userId', selectedUser);
            formData.append('status', status);

            // Adicionar estado das imagens
            formData.append('manterImagemAntes', previewImages.imagemAntes ? 'true' : 'false');
            formData.append('manterImagemDepois', previewImages.imagemDepois ? 'true' : 'false');

            // Adicionar novas imagens se existirem
            const imagemAntesInput = document.querySelector('input[name="imagemAntes"]');
            const imagemDepoisInput = document.querySelector('input[name="imagemDepois"]');

            if (imagemAntesInput?.files[0]) {
                formData.append('imagemAntes', imagemAntesInput.files[0]);
            }
            if (imagemDepoisInput?.files[0]) {
                formData.append('imagemDepois', imagemDepoisInput.files[0]);
            }
            
            const response = await api.put(`/tarefas/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setStatusMessage({
                    message: 'Tarefa atualizada com sucesso!',
                    type: 'success'
                });
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            setStatusMessage({
                message: 'Erro ao atualizar tarefa. Tente novamente.',
                type: 'error'
            });
            setTimeout(() => setStatusMessage({ message: '', type: '' }), 2000);
        }
    }

    const handleStatusChange = (e) => {
        e.preventDefault();
        setStatus(!status);
    };

    if (loading) return <Loading />;
    if (!tarefa) return <div>Tarefa não encontrada</div>;

    //const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';
   
  return (
    <>
        <PageTitle title="Editar Tarefa" />
        
        <div id="main" className={styles.main}>
            <div className="container">
                {statusMessage.message && (
                    <StatusMessage 
                        message={statusMessage.message} 
                        type={statusMessage.type} 
                    />
                )}

                {tarefa && (
                    <>
                    <form onSubmit={handleSubmit}>

                    {hasRole(['admin', 'gerente']) && (
                        <>
                            <div className="form-item">
                                <input type="text" placeholder="Título" className={styles.inputTitulo} ref={inputTitulo} required />
                            </div>
                            <div className="form-item">
                                <textarea placeholder="Descrição" ref={inputDescricao} />
                            </div>
                        </> 
                    )}

                    {hasRole(['colaborador']) && (
                        <>
                            <div className="form-item">
                                <h2>{tarefa.titulo}</h2>
                            </div>
                            <div className="form-item">
                                <p>{tarefa.descricao}</p>
                            </div>
                        </>
                    )}
                        
                         

                        <div className="form-item">
                            <div className={`${styles.checkbox} ${status ? styles.active : ''}`}>
                                <input 
                                    type="checkbox" 
                                    checked={status} 
                                    onChange={(e) => setStatus(e.target.checked)} 
                                />
                                <label onClick={handleStatusChange}>{ status ? 'Tarefa concluída' : 'Concluir Tarefa?' }</label>
                            </div>
                        </div>
                      
                        {hasRole(['admin', 'gerente']) && (
                            <div className="form-item">
                                <label>Colaborador Responsável: </label>
                                <select 
                                    value={selectedUser} 
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    required
                                >
                                    <option value="">- Selecione um colaborador -</option>
                                    {usuarios.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        
                        {/* Exibir imagens atuais */}
                        <div className={styles.currentImages}>
                            <div className={styles.antes}>              
                                <h3>Imagem Antes</h3>                      
                                {previewImages.imagemAntes ? (
                                    <div className={styles.imageContainer}>
                                        <img 
                                            src={previewImages.imagemAntes}
                                            alt="Preview Antes"
                                            className={styles.previewImage}
                                        />
                                        {hasRole(['admin', 'gerente']) && (
                                            <button 
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteImage('imagemAntes')}
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <p className={styles.noImage}>Nenhuma imagem selecionada</p>
                                )}

                                {hasRole(['admin', 'gerente']) && (
                                    <div className="form-item">
                                        <label>Selecionar:</label>
                                    <input 
                                        type="file" 
                                        name="imagemAntes"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'imagemAntes')}
                                            className={styles.fileInput}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className={styles.depois}>
                                <h3>Imagem Depois</h3>
                                {previewImages.imagemDepois ? (
                                    <div className={styles.imageContainer}>
                                        <img 
                                            src={previewImages.imagemDepois}
                                            alt="Preview Depois"
                                            className={styles.previewImage}
                                        />
                                        <button 
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteImage('imagemDepois')}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ) : (
                                    <p className={styles.noImage}>Nenhuma imagem selecionada</p>
                                )}

                                <div className="form-item">
                                    <label>Selecionar:</label>
                                    <input 
                                        type="file" 
                                        name="imagemDepois"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'imagemDepois')}
                                        className={styles.fileInput}
                                    />
                                </div>
                            </div>
                        </div>  

                        <div className="form-item">
                            <label>Observações:</label>
                            <textarea 
                                placeholder="Observações" 
                                ref={inputObservacoes}
                            />
                        </div>    

                        <div className="form-item">
                            <button type="submit">Atualizar Tarefa</button>
                        </div> 

                        {hasRole(['admin', 'gerente']) && (
                            <div className="form-item">
                                <a className={styles.askDelete} onClick={() => askDelete()}><FaRegTrashAlt /> Excluir Tarefa</a>
                            </div>   
                        )}             
                        
                             

                                       
                    </form>                   
                </>
                )}
            </div>
        </div>
    </>    
  )
}

export default EditarTarefa