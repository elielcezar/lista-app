import ListaImoveis from '@/components/lista-imoveis';
import CriarTarefaBtn from '@/components/CriarTarefaBtn';
import './style.css';

function Home() {   
  
  return (
    <>      
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