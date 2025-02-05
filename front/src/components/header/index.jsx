import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import styles from './styles.module.css'

function Header() {

    
    const navigate = useNavigate();  


    return (
        <header className={styles.header}>            
            <div className={styles.logo}>
                <NavLink to="/" end>Lista App</NavLink>
            </div>                            
        </header>
    );
}

export default Header;