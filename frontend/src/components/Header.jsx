import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from './AuthContext'
import UserAvatar from './user/UserAvatar'

import { ROUTES } from '../config/paths'
import { ROLES } from '../config/roles'

export const Header = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout();
        navigate(ROUTES.HOME);
    }

    return (
        <header className="navbar sticky-top bg-white w-100">
            <div className="container-fluid">
                { /* Logo y Título */}
                <NavLink to='/' className="navbar-brand d-flex align-items-center gap-3">
                    <img
                        src='/src/assets/logo.svg'
                        alt="Logo"
                        width='50'
                        height='auto'
                        className='img-fluid'
                    />
                    <h1 className="primary-color text mb-0">Fast Booking</h1>
                </NavLink>

                { /* Menu Desktop */}
                <ul className='nav justify-content-end gap-2 d-none d-md-flex'>
                    {isAuthenticated ? (
                        <>
                            <NavLink
                                className='d-flex flex-row align-items-center gap-2 text-reset text-decoration-none'
                                to={ROUTES.PROFILE}
                            >
                                <span className='fw-bold'>¡Hola {user.firstname}!</span>
                                <UserAvatar firstname={user.firstname} lastname={user.lastname} />
                            </NavLink>
                            {user.role === ROLES.ADMIN && (
                                <li><button className='btn btn-primary h-100' onClick={() => navigate(ROUTES.ADMIN.ROOT)}>Panel Admin</button></li>
                            )}
                            <li><button className='btn btn-primary h-100' onClick={() => handleLogout()}>Cerrar sesión</button></li>
                        </>
                    ) :
                        <>
                            <li><button className='btn btn-primary h-100' onClick={() => navigate(ROUTES.REGISTER)}>Crear cuenta</button></li>
                            <li><button className='btn btn-primary h-100' onClick={() => navigate(ROUTES.LOGIN)}>Iniciar sesión</button></li>
                        </>
                    }
                </ul>

                { /* Menu Mobile */}
                <button
                    className="btn btn-primary d-md-none"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls='offcanvasRight'
                > <FontAwesomeIcon icon={faBars} /> </button>

                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasRightLabel">Fast Booking</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="nav flex-column gap-2">
                            {isAuthenticated ? (
                                <>
                                    <>
                                        <li className="nav-item fw-bold text-center">¡Hola {user.firstName}!</li>
                                        <li><button className='btn btn-light w-100' onClick={() => navigate(ROUTES.PROFILE)} data-bs-dismiss="offcanvas">Mi Perfil</button></li>
                                        {user.role === ROLES.ADMIN && (
                                            <li><button className='btn btn-light w-100' onClick={() => navigate(ROUTES.ADMIN.ROOT)} data-bs-dismiss="offcanvas">Administración</button></li>
                                        )}
                                        <hr />
                                        <li><button className='btn btn-danger w-100' onClick={() => handleLogout()} data-bs-dismiss="offcanvas">Cerrar sesión</button></li>
                                    </>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <button className='btn' onClick={() => navigate(ROUTES.REGISTER)}>Crear cuenta</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className='btn' onClick={() => navigate(ROUTES.LOGIN)}>Iniciar sesión</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}
