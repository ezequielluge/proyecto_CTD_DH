import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../components/AuthContext'

const ProfilePage = () => {
    const { user, isAuthenticated } = useContext(AuthContext);

    return (
        <div className='container-fluid card d-flex my-3 p-4 w-75'>
            <h3>Tu perfil</h3>
            <div className='my-2'>
                <p><b>Nombre:</b> {user.firstname}</p>
                <p><b>Apellido:</b> {user.lastname}</p>
                <p><b>Correo:</b> {user.email}</p>
                <p><b>Rol:</b> {user.role == "ROLE_ADMIN" 
                        ? "Administrador"
                        : (user.role == "ROLE_USER") 
                            ? "Usuario"
                            : ""
                    }

                </p>
            </div>
        </div>
    )
}

export default ProfilePage