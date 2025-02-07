import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import styles from './styles.module.css';

export default function Extras() {
  const { isAuthenticated, logout } = useContext(AuthContext);    
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();       
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <ul>
        {isAuthenticated ? (
            <ul>
                <li>
                    <a onClick={handleLogout}>Sair</a>
                </li>
            </ul>
        ) : null}
      </ul>
    </div>
  )
}
