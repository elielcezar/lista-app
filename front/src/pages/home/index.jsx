import ListaImoveis from '@/components/lista-imoveis';
import CriarTarefaBtn from '@/components/CriarTarefaBtn';
import PageTitle from '../../components/PageTitle';
import './style.css';

function Home() {   
  
  return (
    <>      
      <PageTitle title="Tarefas Ativas"/>
      <div id="main">
        <div className="container">  
          <ListaImoveis />  
          <CriarTarefaBtn/>  
        </div> 
      </div>
    </>
  )
}

export default Home