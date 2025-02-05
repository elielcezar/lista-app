import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import './style.css'

export const Usuario = () => {

    const params = useParams();

    const inputName = useRef();    
    const inputEmail = useRef();
    const inputPassword = useRef(); 

    const [userData, setUserData] = useState('');   
    const [confirmationMessage, setConfirmationMessage] = useState(''); 

    async function getUser(){
        const userFromAPI = await api.get(`usuarios/${params.id}`);
        setUserData(userFromAPI.data);        
    }

    useEffect(() => {
        getUser();               
    }, []);

    useEffect(() => {    
        if (userData) {
            inputName.current.value = userData.name;
            inputEmail.current.value = userData.email;            
        }
    }, [userData]); 

    async function updateUser(){        
        const name = inputName.current.value;
        const email = inputEmail.current.value;
        const password = inputPassword.current.value;

        if (!name || !email || !password) {
            setConfirmationMessage('Todos os campos são obrigatórios.');
            setTimeout(() => setConfirmationMessage(''), 5000);
            return;
        }

        const updatedUserData = {
            name,
            email,
            password
        };    

        console.log(updatedUserData);    

        try {
            const response = await api.put(`/usuarios/${params.id}`, updatedUserData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) { 
                setConfirmationMessage('Usuário atualizado com sucesso!');
                setTimeout(() => setConfirmationMessage(''), 5000);
            } else {
                throw new Error('Erro ao atualizar usuário');
            }
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
            setConfirmationMessage('Erro ao atualizar usuário.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }
    }   
      

    return (

        <div className="container">
            <h1>{userData.name}</h1>
            {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}
            <form>
                <div className="form-item">
                    <input type="text" name="name" className="name" placeholder='Nome' ref={inputName}  />
                </div>           
                <div className="form-item">
                    <input type="email" name="email" className="email" placeholder='Email' ref={inputEmail} />
                </div>
                <div className="form-item">
                    <input type="password" name="password" className="password" placeholder='Senha' ref={inputPassword} />
                </div>                 
                <div className="form-item">
                    <button type='button' onClick={updateUser}>- Enviar -</button>
                </div>
            </form>   
        </div>
    )
}

export default Usuario