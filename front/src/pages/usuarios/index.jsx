import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import styles from './styles.module.css'

export const Usuarios = () => {
  
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  
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

  async function editUser(id) {         
      navigate(`/usuarios/${id}`);    
  }

  const baseUrl = '/usuarios/'; 
  
  return (
    <>
      <h2 className={styles.pagetitle}>Usuários</h2> 
      <div id="main">
        <div className="container">           
          <div className={styles.listaUsuarios}>
              {users.map((user) => (                
                  <div className={styles.item} key={user.id}>
                      <h3><a href={`${baseUrl}${user.id}`}>{user.name}</a></h3>
                      <p>{user.email}</p>
                      <button onClick={() => deleteUser(user.id)} className={styles.excluir}>Excluir</button>
                      <button onClick={() => editUser(user.id)} className={styles.editar}>Editar</button>
                  </div>                
              ))}
          </div>
        </div>     
      </div> 
    </>
  )
}

export default Usuarios