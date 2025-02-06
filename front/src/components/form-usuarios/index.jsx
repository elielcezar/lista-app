import { useState, useEffect } from "react";
import api from '../../services/api';
import './style.css';

const ListaUsuarios = ( {selectedId, onChange} ) => {

    const [usuarios, setUsuarios] = useState([]);
    const [selectedValue, setSelectedValue] = useState(selectedId);

    async function getUsuarios(){
        const usuariosFromAPI = await api.get(`/usuarios`);
        setUsuarios(usuariosFromAPI.data);          
    }
    
    useEffect(() => {        
        getUsuarios();               
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
            {usuarios.map((usuario) => (
                <option value={usuario.id} key={usuarios.id}>{usuario.name}</option>
            ))}
        </select>
    </>
)


}


export default ListaUsuarios