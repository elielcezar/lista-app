import { NavLink, useLocation } from 'react-router-dom';
import styles from './styles.module.css'

function Header() {
    const location = useLocation();
    const isHomePage = location.pathname === '/login';

    return (
        <header className={`${styles.header} ${isHomePage ? styles.headerHidden : ''}`}>            
            <div className={styles.logo}>
                <NavLink to="/" end>Lista App</NavLink>
            </div>                            
        </header>
    );
}

export default Header;