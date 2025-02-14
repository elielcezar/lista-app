import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { FaTrash } from "react-icons/fa";
import StatusMessage from '@/components/StatusMessage';
import PageTitle from '@/components/PageTitle';
import { useAuth } from '@/context/AuthContext';
import styles from './styles.module.css';

function CadastrarTarefa() {

    const { user } = useAuth();
    const navigate = useNavigate();    
    const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
    
    const [previewImages, setPreviewImages] = useState({
        imagemAntes: null,
        imagemDepois: null
    });
    
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

            console.log('entrou no try');
            
            // Verificar campos obrigatórios
            if (!inputTitulo.current?.value) {
                setStatusMessage({
                    message: 'O campo título é obrigatório.',
                    type: 'error'
                });
                return;
            }

            // Adicionar campos ao FormData
            formData.append('titulo', inputTitulo.current.value);
            formData.append('descricao', inputDescricao.current.value);
            formData.append('userId', selectedUser);
            formData.append('authorId', user.id);

            console.log('form data: ', formData);

            // Adicionar imagens se existirem
            const imagemAntesInput = document.querySelector('input[name="imagemAntes"]');
            const imagemDepoisInput = document.querySelector('input[name="imagemDepois"]');

            if (imagemAntesInput?.files[0]) {
                formData.append('imagemAntes', imagemAntesInput.files[0]);
            }
            if (imagemDepoisInput?.files[0]) {
                formData.append('imagemDepois', imagemDepoisInput.files[0]);
            }

            console.log('Datos enviados: ', formData);

            const response = await api.post('/tarefas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                setStatusMessage({
                    message: 'Tarefa cadastrada com sucesso!',
                    type: 'success'
                });
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            console.error('Erro ao cadastrar tarefa:', error);
            setStatusMessage({
                message: 'Erro ao cadastrar tarefa. Tente novamente.',
                type: 'error'
            });
        }
    }

    return (
        <>
            <PageTitle title="Cadastrar Nova Tarefa" />
            
            <div id="main">
                <div className="container">
                    {statusMessage.message && (
                        <StatusMessage 
                            message={statusMessage.message} 
                            type={statusMessage.type} 
                        />
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-item">
                            <input 
                                type="text" 
                                placeholder="Título" 
                                ref={inputTitulo}
                                required 
                            />
                        </div>
                        
                        <div className="form-item">
                            <textarea 
                                placeholder="Descrição" 
                                ref={inputDescricao}                                 
                            />
                        </div>

                        <div className="form-item">
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
                            <button type="submit">Cadastrar Tarefa</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CadastrarTarefa;