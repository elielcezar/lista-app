import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FaTrash } from "react-icons/fa";
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

    const [previewImages, setPreviewImages] = useState({
        imagemAntes: null,
        imagemDepois: null
    });

    const [tarefa, setTarefa] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const inputTitulo = useRef(null);
    const inputDescricao = useRef(null);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

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
                const response = await api.get(`/tarefas/id/${id}`);
                setTarefa(response.data);
                setSelectedUser(response.data.user?.id.toString() || '');
                
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
        if (tarefa && inputTitulo.current && inputDescricao.current) {
            inputTitulo.current.value = tarefa.titulo;
            inputDescricao.current.value = tarefa.descricao || '';
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

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            
            formData.append('titulo', inputTitulo.current.value);
            formData.append('descricao', inputDescricao.current.value);
            formData.append('userId', selectedUser);

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
        }
    }

    const updateFormData = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Primeiro, vamos criar uma função auxiliar para verificar se a imagem existe
    function hasValidImage(imageUrl) {
        return imageUrl && imageUrl !== 'null' && imageUrl !== 'undefined' && imageUrl.trim() !== '';
    }

    if (loading) return <Loading />;
    if (!tarefa) return <div>Tarefa não encontrada</div>;

    const baseUrl = import.meta.env.VITE_UPLOADS_URL + '/';
   
  return (
    <>
        <PageTitle title="Editar Tarefa" />
        
        <div id="main">
            <div className="container">
                {statusMessage.message && (
                    <StatusMessage 
                        message={statusMessage.message} 
                        type={statusMessage.type} 
                    />
                )}

                {tarefa && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-item">
                            <input type="text" placeholder="Título" ref={inputTitulo} required />
                        </div>
                        
                        <div className="form-item">
                            <textarea placeholder="Descrição" ref={inputDescricao} />
                        </div>

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
                                        <button 
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() => handleDeleteImage('imagemAntes')}
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
                                        name="imagemAntes"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'imagemAntes')}
                                        className={styles.fileInput}
                                    />
                                </div>
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
                            <button type="submit">Atualizar Tarefa</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    </>    
  )
}

export default EditarTarefa