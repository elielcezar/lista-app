import { useState, useEffect } from "react";
import api from '../../services/api';
import './style.css';

const ListaCategorias = ( {endpoint, selectedId, onChange} ) => {

    const [categorias, setCategorias] = useState([]);
    const [selectedValue, setSelectedValue] = useState(selectedId);

    async function getCategoria(){
        const categoriaFromAPI = await api.get(`/${endpoint}`);
        setCategorias(categoriaFromAPI.data);          
    }
    
    useEffect(() => {        
        getCategoria();               
    }, []);

    useEffect(() => {
        setSelectedValue(selectedId);
    }, [selectedId]);   

    const handleChange = (e) => {
        setSelectedValue(e.target.value);
        if (onChange) {
            onChange(e.target.value);
            console.log('Valor:', e.target.value)
        }
    };
    
    
return(
    <>    
        <select value={selectedValue} onChange={handleChange}>
            <option value="">- Selecione uma opção -</option>
            {categorias.map((categoria) => (
                <option value={categoria.id} key={categoria.id}>{categoria.name}</option>
            ))}
        </select>
    </>
)


}


export default ListaCategorias