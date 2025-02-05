import { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import FormCategorias from '../../../components/form-categorias';
import './style.css';

function CadastroImovel() {     
    
    const [confirmationMessage, setConfirmationMessage] = useState('');  

    const [selectedUsers, setSelectedUsers] = useState([]);
    
    const inputTitulo = useRef();        
    const inputDescricaoLonga = useRef();
    //const inputUsuarios = useRef();
    const inputFotos = useRef();    

    async function handleSubmit(event) {

        event.preventDefault();

        // Verificar se todos os campos obrigatórios estão preenchidos
        /*if (!inputTitulo.current.value || 
            !inputCodigo.current.value || 
            !inputFotos.current.value ||             
            !inputFinalidade.current.value || 
            !inputValor.current.value || 
            !inputEndereco.current.value || 
            !inputCidade.current.value) {
            setConfirmationMessage('Por favor, preencha todos os campos obrigatórios.');
            setTimeout(() => setConfirmationMessage(''), 5000);
            return;
        }*/
        
        const formData = new FormData();
            formData.append('titulo', inputTitulo.current.value);            
            formData.append('descricaoLonga', inputDescricaoLonga.current.value);                   
            formData.append('usuarios', selectedUsers);

        // Adiciona múltiplas fotos ao FormData e ao objeto userData para log
        Array.from(inputFotos.current.files).forEach((file, index) => {
            formData.append('fotos', file);            
        });

        // Loga o conteúdo do FormData no console
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }        

        try {            
            const response = await api.post('/imoveis', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Response:', response);

            if (response.status === 200 || response.status === 201) {                

                inputTitulo.current.value = '';                
                inputDescricaoLonga.current.value = '';
                //inputUsuarios.current.value = '';
                inputFotos.current.value = '';     
                setSelectedUsers([]);                           

                setConfirmationMessage('Imóvel cadastrado com sucesso!');
                setTimeout(() => setConfirmationMessage(''), 5000);
                
            } else {
                throw new Error('Erro ao cadastrar imóvel');
            }
        } catch (error) {
            console.error('Erro ao cadastrar imóvel:', error);
            console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
            setConfirmationMessage('Erro ao cadastrar imóvel.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }
    }
   
  return (
    <div id="main">
        <div className="container">        
            <h1>Cadastrar novo imóvel</h1>
            
            {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}

            <form>                
                <div className="form-item">
                    <label htmlFor="titulo">Título</label>
                    <input type="text" name="titulo" className="titulo" ref={inputTitulo} />
                </div>                                           
                <div className="form-item">   
                    <label htmlFor="subtitulo">Descrição longa</label>             
                    <textarea name="descricaoLonga" className="descricaoLonga" ref={inputDescricaoLonga}></textarea>
                </div>
                <div className="form-item">
                    <label htmlFor="subtitulo">Enviar para: </label>
                    <FormCategorias endpoint="usuarios" onChange={setSelectedUsers} />
                </div>
                <div className="form-item">
                    <label htmlFor="subtitulo">Fotos</label>
                    <input type="file" name="fotos" className="fotos" ref={inputFotos} multiple />
                </div>    

                <div className="form-item">
                    <button type='button' onClick={handleSubmit}>- Enviar -</button>
                </div>

            </form>       
        </div>      
    </div>
  )
}

export default CadastroImovel