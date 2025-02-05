import { useState, useRef } from 'react';
import './style.css'
import api from '../../services/api'

function CadastroUsuario() { 
    
    const [confirmationMessage, setConfirmationMessage] = useState('');  
 
    const inputName = useRef();    
    const inputEmail = useRef();
    const inputPassword = useRef();    

    async function createUser() {

        const userData = {
            name: inputName.current.value,
            email: inputEmail.current.value,
            password: inputPassword.current.value
        };        
        console.log(userData);    

        try {
            const response = await api.post('/usuarios', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {                

                inputName.current.value = '';
                inputEmail.current.value = '';
                inputPassword.current.value = '';                

                setConfirmationMessage('Usuário cadastrado com sucesso!');
                setTimeout(() => setConfirmationMessage(''), 5000);
            } else {
                throw new Error('Erro ao cadastrar usuário');
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
            setConfirmationMessage('Erro ao cadastrar usuário.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }
    }
   
  return (
    <div id="main">
    
      <div className="container"> 

        <h1>Cadastrar novo usuário</h1>       
        {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}

        <form>
            <div className="form-item">
                <input type="text" name="name" className="name" placeholder='Nome' ref={inputName} />
            </div>           
            <div className="form-item">
                <input type="email" name="email" className="email" placeholder='Email' ref={inputEmail} />
            </div>
            <div className="form-item">
                <input type="password" name="password" className="password" placeholder='Senha' ref={inputPassword} />
            </div>            
            <div className="form-item">
                <button type='button' onClick={createUser}>- Enviar -</button>
            </div>
        </form>       
        
      </div>      
    </div>
  )
}

export default CadastroUsuario