import { useAuth } from '@/context/AuthContext';
import ListaTarefasGerente from '@/components/ListaTarefas/Gerente';
import ListaTarefasColaborador from '@/components/ListaTarefas/Colaborador';
import ButtonCreate from '@/components/ButtonCreate';
import PageTitle from '@/components/PageTitle';
import styles from './styles.module.css';

function Home() {  
  const { user, hasRole } = useAuth();  

  return (
    <>      
      <PageTitle title="Tarefas Ativas"/>
      <div id="main" className={styles.mainHome}>
        <div className="container">  
          {!user && <div>Carregando usuário...</div>}
          
          {user && !user.role && <div>Usuário sem role definido: {JSON.stringify(user)}</div>}

          {hasRole(['gerente', 'admin']) && (            
              <ListaTarefasGerente />           
          )}          
          {hasRole(['colaborador']) && (             
              <ListaTarefasColaborador />
          )}
          
        </div> 
      </div>
      {hasRole(['gerente', 'admin']) && (            
          <ButtonCreate path="/cadastro-tarefa"/>
      )}          
      
    </>
  )
}

export default Home