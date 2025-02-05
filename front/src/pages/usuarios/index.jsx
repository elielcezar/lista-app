import { useState, useEffect } from "react";
import api from '../../services/api'
import './style.css'

export const Usuarios = () => {
  
    const [users, setUsers] = useState([]);
  
  async function getUsers() { 
      const usersFromApi = await api.get('/usuarios');
      setUsers(usersFromApi.data.reverse());          
  }

  useEffect(() => {  
      getUsers();
  }, []);    

  async function deleteUser(id) {         
      await api.delete(`/usuarios/${id}`);  
      getUsers();      
  }

  const baseUrl = '/usuarios/'; 
  
  return (
    <>
      <div id="main">
        <div className="container"> 
          <h1>Usuários</h1> 
          <div className='listaUsuarios'>
              {users.map((user) => (                
                  <div className="item" key={user.id}>
                      <p><a href={`${baseUrl}${user.id}`}>{user.name}</a></p>
                      <p>Email: {user.email}</p>
                      <button onClick={() => deleteUser(user.id)}>Excluir</button>
                  </div>                
              ))}
          </div>
        </div>     
      </div> 
    </>
  )
}

export default Usuarios