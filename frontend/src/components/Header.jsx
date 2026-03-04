import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from './AuthContext'


export const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useContext(AuthContext);

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
                    {isAuthenticated 
                        ? <li><button className='btn btn-primary' onClick={() => logout()}>Cerrar sesión</button></li>
                        :
                        <>
                            <li><button className='btn btn-primary' onClick={() => navigate('/register')}>Crear cuenta</button></li>
                            <li><button className='btn btn-primary' onClick={() => navigate('/login')}>Iniciar sesión</button></li>
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
                            <li className="nav-item">
                                <button className='btn' onClick={() => navigate('/register')}>Crear cuenta</button>
                            </li>
                            <li className="nav-item">
                                <button className='btn' onClick={() => navigate('/login')}>Iniciar sesión</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}
