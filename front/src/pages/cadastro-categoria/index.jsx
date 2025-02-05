import { useState, useRef } from 'react';
import './style.css'
import api from '../../services/api'

function CadastroCategoria() { 
    
    const [confirmationMessage, setConfirmationMessage] = useState('');  
 
    const inputName = useRef();    
    
    async function createCategoria() {

        const userData = {
            nome: inputName.current.value,            
        };        
        console.log(userData);    

        try {
            const response = await api.post('/categorias', userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {                

                inputName.current.value = '';
                
                setConfirmationMessage('Categoria cadastrada com sucesso!');
                setTimeout(() => setConfirmationMessage(''), 5000);
            } else {
                throw new Error('Erro ao cadastrar categoria');
            }
        } catch (error) {
            console.error('Erro ao cadastrar categoria:', error);
            console.error('Detalhes do erro:', error.response ? error.response.data : error.message);
            setConfirmationMessage('Erro ao cadastrar categoria.');
            setTimeout(() => setConfirmationMessage(''), 5000);
        }
    }
   
  return (
    <div id="main">
    
      <div className="container"> 

        <h1>Cadastrar nova categoria</h1>       

        {confirmationMessage ? <p className="confirmation-message">{confirmationMessage}</p> : null}

        <form>
            <div className="form-item">
                <input type="text" name="name" className="name" placeholder='Nome' ref={inputName} />
            </div>                      
            <div className="form-item">
                <button type='button' onClick={createCategoria}>- Enviar -</button>
            </div>
        </form>       
        
      </div>      
    </div>
  )
}

/*export default function CategoriaForm({ onCategoriaAdded }) {
    const [nome, setNome] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        const response = await fetch('/api/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome }),
        });
  
        if (response.ok) {
          setNome('');
          onCategoriaAdded();
        }
      } catch (error) {
        console.error('Erro ao criar categoria:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da categoria"
          required
        />
        <button type="submit">Adicionar Categoria</button>
      </form>
    );
  }*/

export default CadastroCategoria