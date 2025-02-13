import { useState, useEffect } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PageTitle from '@/components/PageTitle';
import BtnCreate from '@/components/BtnCreate';
import StatusMessage from '@/components/StatusMessage';
import api from '@/services/api';
import styles from './styles.module.css';

export const Usuarios = () => {

  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();    
  
  async function getUsers() { 
      try {          
          if (!user) return;
          
          setIsLoading(true);

          const response = await api.get(`/usuarios?createdBy=${user.id}`);
          
          if (!response.data || response.data.length === 0) {
              setStatusMessage({ 
                  message: (
                      <>
                          Você não possui colaboradores no momento.{' '}
                          <NavLink to="/cadastro-usuario">Aproveite para criar um.</NavLink>
                      </>
                  ),
                  type: 'message' 
              });
              setUsers([]);
              return;
          }
          setUsers(response.data.reverse());
          setStatusMessage({ message: '', type: '' });
          
      } catch (error) {
          console.error('Erro ao buscar usuários:', error);
          setStatusMessage({ 
              message: 'Erro ao carregar colaboradores. Tente novamente.',
              type: 'error' 
          });
          setUsers([]);
      } finally {
          setIsLoading(false);
      }
  }

  useEffect(() => {        
      getUsers();     
  }, [user]);

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
      <PageTitle title="Colaboradores"/>
      <div id="main">
        <div className="container">  
          {(isLoading) && (
            <div className={styles.loading}>Carregando...</div>
          )}

          {!isLoading && statusMessage.message && (
              <StatusMessage message={statusMessage.message} type={statusMessage.type} />
          )}

          {!isLoading && users.length > 0 && (
            <div className={styles.listaUsuarios}>
                {users.map((usuario) => (                
                    <div className={styles.item} key={usuario.id}>
                        <h3><a href={`${baseUrl}${usuario.id}`}>{usuario.name}</a></h3>
                        <p>{usuario.email}</p>
                        <button onClick={() => deleteUser(usuario.id)} className={styles.excluir}>Excluir</button>
                        <button onClick={() => editUser(usuario.id)} className={styles.editar}>Editar</button>
                    </div>                
                ))}
            </div>
          )}
        </div>     
      </div> 
      <BtnCreate path="/cadastro-usuario"/>
    </>
  )
}

export default Usuarios