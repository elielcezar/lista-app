import { useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { RiTeamLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import Logo from '@/assets/logo-color.webp';
import styles from './styles.module.css';

export default function Extras() {
  const { isAuthenticated, logout } = useContext(AuthContext);    
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();       
    navigate('/login');
  };

  return (
    <div id="main" className={styles.mainlogin}>
      <div className={`${styles.container} container`}>
        <img src={Logo} alt="Task App" className={styles.logo}/>
        <ul>
          {isAuthenticated ? (
              <ul className={styles.extras}>
                  <li className={styles.conta}>
                      <a onClick={handleLogout}><FaRegUser className={styles.icon} /> Minha conta</a>
                  </li>
                  <li className={styles.tarefas}>
                      <NavLink to="/"><MdOutlineTaskAlt className={styles.icon} /> Tarefas</NavLink>
                  </li>
                  <li className={styles.colaboradores}>
                      <NavLink to="/usuarios"><RiTeamLine className={styles.icon} /> Colaboradores</NavLink>
                  </li>                  
                  <li className={styles.sair}>
                      <a onClick={handleLogout}><IoMdExit className={styles.icon} /> Sair</a>
                  </li>
              </ul>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
