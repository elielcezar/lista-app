import { NavLink } from 'react-router-dom';
import { useState, useRef } from 'react';
import PageTitle from '@/components/PageTitle';
import api from '@/services/api'
import StatusMessage from '@/components/StatusMessage';
import styles from './styles.module.css';
function CadastroUsuario() { 
    
    const [confirmationMessage, setConfirmationMessage] = useState({ message: '', type: '' });  
 
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

                setConfirmationMessage({
                    message: (
                        <>
                            Novo usuário cadastrado com sucesso! <NavLink to="/login">Você já pode fazer login.</NavLink>
                        </>
                    ),
                    type: 'success'
                });                
                
            } else {
                throw new Error('Erro ao cadastrar usuário');
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
            
            setConfirmationMessage({
                message: 'Erro ao cadastrar usuário.',
                type: 'error'
            });
            setTimeout(() => setConfirmationMessage({ message: '', type: '' }), 2000);
        }
    }
   
  return (
    <>
        <PageTitle title="Crie sua conta"/>

        <div id="main">    
            <div className={`container ${styles.container}`}>         
                
                {confirmationMessage.message && (
                    <StatusMessage 
                        message={confirmationMessage.message} 
                        type={confirmationMessage.type} 
                    />
                )}
                
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
                        <button type='button' onClick={createUser}>Cadastrar</button>
                    </div>

                    <div className="extras">
                        <p>Já possui uma conta? <NavLink to="/login">Faça login aqui!</NavLink></p>
                    </div>
                </form>     
                
            </div>      
            </div>
    </>    
  )
}

export default CadastroUsuario