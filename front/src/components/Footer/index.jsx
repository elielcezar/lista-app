import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import { HiDotsHorizontal } from "react-icons/hi";
import styles from './styles.module.css';

export default function Footer() {    
    
    const { hasRole } = useAuth();

    const { isAuthenticated } = useAuth();   

    return (
        <footer className={styles.footer}>
            <div className="container">
                {isAuthenticated ? (
                    <nav className={styles.nav}>
                        <ul>                               
                            <li className={styles.tarefas}>
                                <NavLink to="/">
                                    <FaRegCheckCircle />                                    
                                    Tarefas
                                </NavLink>
                            </li>
                            <li className={styles.arquivo}>
                                <NavLink to="/tarefas-arquivadas">
                                    <IoDocumentTextOutline />
                                    Arquivo
                                </NavLink>
                            </li>
                            {hasRole(['admin', 'gerente']) && (
                                <li className={styles.usuarios}>
                                    <NavLink to="usuarios">
                                        <RiTeamLine />
                                        Colaboradores
                                    </NavLink>
                                </li>   
                            )}                                                     
                            <li className={styles.mais}>
                                <NavLink to="/extras">
                                    <HiDotsHorizontal />
                                    Mais
                                </NavLink>
                            </li>                            
                        </ul>
                    </nav>                            
                ) : null }   
            </div>
        </footer>
    );
}
