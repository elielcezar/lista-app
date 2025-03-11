import { useState, useEffect } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { detectarTipoIdentificador, formatarTelefone } from '@/utils/validation';
import PageTitle from '@/components/PageTitle';
import ButtonCreate from '@/components/ButtonCreate';
import StatusMessage from '@/components/StatusMessage';
import InlineMessage from '@/components/InlineMessage';
import Loading from '@/components/Loading';
import api from '@/services/api';
import styles from './styles.module.css';

export const Usuarios = () => {

  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [inlineMessage, setInlineMessage] = useState({ message: '', type: '' });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();    
  
  async function getUsers() { 
      try {          
          if (!user?.id) {
              console.error('ID do usuário não disponível');
              return;
          }
          
          setIsLoading(true);
          console.log('Buscando usuários criados por:', user.id);

          const response = await api.get('/usuarios', {
              params: {
                  createdBy: user.id
              }
          });
          
          console.log('Resposta da API:', response.data);
          
          if (!response.data || response.data.length === 0) {
              setInlineMessage({ 
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
      } catch (error) {
          console.error('Erro ao buscar usuários:', error);
          if (error.response) {
              console.error('Detalhes do erro:', error.response.data);
          }
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

  async function deleteUser(e, id) {         
    try {
        const response = await api.delete(`/usuarios/${id}`);  
        if (response.status === 200) {
            const card = e.target.closest(`.${styles.item}`);
            if (card) {
                card.classList.add(styles.finished);
            }                    
            setTimeout(() => { 
                getUsers(); 
            }, 250);           
            setTimeout(() => {                
                setStatusMessage({ 
                    message: (
                        <>
                            Usuário excluído com sucesso.
                        </>
                    ),
                    type: 'success' 
                });      
            }, 500);           
            setTimeout(() => {                
                setStatusMessage({ message: '', type: '' });                
            }, 2500);           
        } 
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        setStatusMessage({ 
            message: 'Erro ao excluir usuário. Tente novamente.',
            type: 'error' 
        });
        setTimeout(() => {                
            setStatusMessage({ message: '', type: '' });                
        }, 2000);   
    }
  }

  async function editUser(id) {         
      navigate(`/usuarios/${id}`);    
  }

  const baseUrl = '/usuarios/'; 
  
  // Função para exibir o identificador formatado
  const exibirIdentificador = (identifier) => {
    const tipo = detectarTipoIdentificador(identifier);
    return tipo === 'telefone' ? formatarTelefone(identifier) : identifier;
  };
  
  return (
    <>
      <PageTitle title="Colaboradores"/>
      <div id="main">
        <div className="container">  
          {(isLoading) && (
            <Loading />
          )}

          {!isLoading && statusMessage.message && (
              <StatusMessage message={statusMessage.message} type={statusMessage.type} />
          )}

          {!isLoading && inlineMessage.message && (
            <InlineMessage message={inlineMessage.message} type={inlineMessage.type} />
          )}

          {!isLoading && users.length > 0 && (
            <div className={styles.listaUsuarios}>
                {users.map((usuario) => (                
                    <div className={styles.item} key={usuario.id}>
                        <h3><a href={`${baseUrl}${usuario.id}`}>{usuario.name}</a></h3>
                        <p>{exibirIdentificador(usuario.identifier)}</p>
                        <button 
                            onClick={(e) => deleteUser(e, usuario.id)} 
                            className={styles.excluir}
                        >
                            Excluir
                        </button>
                        <button onClick={() => editUser(usuario.id)} className={styles.editar}>Editar</button>
                    </div>                
                ))}
            </div>
          )}
        </div>     
      </div> 
      <ButtonCreate path="/cadastro-usuario"/>
    </>
  )
}

export default Usuarios