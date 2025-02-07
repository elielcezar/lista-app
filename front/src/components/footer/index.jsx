import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import styles from './styles.module.css';

export default function Footer() {

    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();  

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <footer className={styles.footer}>
            
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
                            <li className={styles.usuarios}>
                                <NavLink to="usuarios">
                                    <FaRegUser />
                                    Usuários
                                </NavLink>
                            </li>                            
                            <li className={styles.mais}>
                                <NavLink to="/extras">
                                    <HiDotsHorizontal />
                                    Mais
                                </NavLink>
                            </li>                            
                        </ul>

                    </nav>                            

                ) : null }   
            
        </footer>
    );
}
