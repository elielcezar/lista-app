import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/api';
import { FaTrash } from "react-icons/fa";
import styles from './styles.module.css';
import StatusMessage from '@/components/StatusMessage';
import PageTitle from '@/components/PageTitle';

function EditarTarefa() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
    const [tarefa, setTarefa] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const inputTitulo = useRef(null);
    const inputDescricao = useRef(null);
    const inputImagemAntes = useRef(null);
    const inputImagemDepois = useRef(null);   
    
    const [formData, setFormData] = useState({
        titulo: '',       
        descricao: '',       
        fotos: ''
    });    

    const [usuarios, setUsuarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        async function loadUsuarios() {
            try {
                const response = await api.get('/usuarios');
                setUsuarios(response.data);
            } catch (error) {
                console.error('Erro ao carregar usuários:', error);
            }
        }
        loadUsuarios();
    }, []);

    useEffect(() => {
        async function loadTarefa() {
            try {
                const response = await api.get(`/tarefas/id/${id}`);
                setTarefa(response.data);
                setSelectedUser(response.data.user?.id.toString() || '');
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

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData();
            
            formData.append('titulo', inputTitulo.current.value);
            formData.append('descricao', inputDescricao.current.value);
            formData.append('userId', selectedUser);
            
            if (inputImagemAntes.current?.files[0]) {
                formData.append('imagemAntes', inputImagemAntes.current.files[0]);
            }
            if (inputImagemDepois.current?.files[0]) {
                formData.append('imagemDepois', inputImagemDepois.current.files[0]);
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

    async function handleDeleteImage(imageType) {
        try {
            const response = await api.patch(`/tarefas/${id}/image`, {
                imageType,
                action: 'delete'
            });

            if (response.status === 200) {
                setTarefa(response.data);
                
                setStatusMessage({
                    message: 'Imagem removida com sucesso!',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error('Erro ao excluir imagem:', error);
            setStatusMessage({
                message: 'Erro ao excluir imagem. Tente novamente.',
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

    // Função para fazer upload automático
    async function handleImageChange(e, imageType) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append(imageType, file);

            setStatusMessage({
                message: 'Enviando imagem...',
                type: 'info'
            });

            const response = await api.put(`/tarefas/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setTarefa(response.data);
                setStatusMessage({
                    message: 'Imagem atualizada com sucesso!',
                    type: 'success'
                });
            }
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            setStatusMessage({
                message: 'Erro ao enviar imagem. Tente novamente.',
                type: 'error'
            });
        }
    }

    if (loading) return <div>Carregando...</div>;
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
                                <option value="">Selecione um usuário</option>
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
                                {hasValidImage(tarefa.imagemAntes) ? (
                                    <div className={styles.imageContainer}>
                                        <img 
                                            src={`${import.meta.env.VITE_UPLOADS_URL}/${tarefa.imagemAntes}`}
                                            alt="Imagem Antes"
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
                                    <p className={styles.noImage}>Nenhuma imagem cadastrada</p>
                                )}

                                <div className="form-item">
                                    <label>Nova Imagem Antes:</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'imagemAntes')}
                                        className={styles.fileInput}
                                    />
                                </div>
                            </div>
                            <div className={styles.depois}>              
                                <h3>Imagem Depois</h3>
                                {hasValidImage(tarefa.imagemDepois) ? (
                                    <div className={styles.imageContainer}>
                                        <img 
                                            src={`${import.meta.env.VITE_UPLOADS_URL}/${tarefa.imagemDepois}`}
                                            alt="Imagem Depois"
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
                                    <p className={styles.noImage}>Nenhuma imagem cadastrada</p>
                                )}

                                <div className="form-item">
                                    <label>Nova Imagem Depois:</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'imagemDepois')}
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