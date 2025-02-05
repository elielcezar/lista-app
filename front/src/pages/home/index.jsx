import { EmblaCarousel } from '../../components/carrossel';  
import ListaImoveis from '@/components/lista-imoveis';
import './style.css';

function Home() {   
  
  return (
    <>
      <EmblaCarousel />
      <div className="container">  
        <ListaImoveis />    
      </div> 
    </>
  )
}

export default Home