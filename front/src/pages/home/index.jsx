import ListaTarefas from '@/components/ListaTarefas';
import CriarTarefaBtn from '@/components/CriarTarefaBtn';
import PageTitle from '../../components/PageTitle';
import styles from './styles.module.css';


function Home() {   
  
  return (
    <>      
      <PageTitle title="Tarefas Ativas"/>
      <div id="main" className={styles.mainHome}>
        <div className="container">  
          <ListaTarefas />            
        </div> 
      </div>
      <CriarTarefaBtn/>  
    </>
  )
}

export default Home