import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type={location.pathname === '/' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} ml-10 ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type={location.pathname === '/feed' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Logo />
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`
          }
        >
          <ProfileIcon
            type={location.pathname.startsWith('/profile') ? 'primary' : 'secondary'}
          />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </NavLink>
      </nav>
    </header>
  );
};
