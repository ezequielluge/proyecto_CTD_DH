import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';


import { USER_ENDPOINT } from '../../config/config'
import { ROLES } from '../../config/roles';
import { AuthContext } from '../../components/AuthContext';
import { ROUTES } from '../../config/paths';


const AdminUsersPage = () => {
    const navigate = useNavigate();
    const { user: visitor, logout } = useContext(AuthContext)

    const url = USER_ENDPOINT;
    const {
        data: users,
        isLoading,
        error,
        setData
    } = useFetch(url);

    const handleRoleUpdate = async (userId, currentRole, newRole) => {
        if (currentRole === newRole) return;

        const confirm = await Swal.fire({
            title: '¡Modificacion de permisos!',
            text: `¿Desea asignar ${newRole} al usuario con ID ${userId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2FBF71',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                const response = await api(`${USER_ENDPOINT}/${userId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: newRole
                });

                if (response && response.ok) {
                    const updatedUsers = users.map(
                        user => user.userId === userId ? { ...user, role: newRole } : user
                    );
                    setData(updatedUsers);

                    Swal.fire({
                        title: '¡Rol actualizado!',
                        text: `El rol del usuario con ID ${userId} ha sido actualizado con éxito.`,
                        icon: 'success',
                        confirmButtonText: "Cerrar"
                    }).then(_ => {
                        if (visitor.id == userId) {
                            Swal.fire(
                                'Sesion finalizada',
                                'Tus permisos han cambiado, por favor inicie sesión nuevamente',
                                'info'
                            ).then( _ => {
                                logout();
                                navigate(ROUTES.LOGIN)
                            });
                        }
                    });
                } else {
                    throw new Error("Ha ocurrido un error al actualizar el rol.");
                }

            } catch (error) {
                console.error(error.message);
                Swal.fire(
                    'Error',
                    `${error.message}`,
                    'error'
                );
                setData(users.map(u => u.userId === userId ? { ...u} : u));
            }
        } else {
            setData(users.map(u => u.userId === userId ? { ...u} : u));
        }
    }

    const handleRemove = async (userId) => {
        if (userId == visitor.id) {
            Swal.fire(
                'Advertencia',
                'No es posible eliminar el mismo usuario con el que ha ingresado',
                'error'
            );
            return;
        }

        const confirm = await Swal.fire({
            title: '¡Eliminar!',
            text: `¿Desea eliminar permanentemente al usuario con ID ${userId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2FBF71',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                const response = await api(`${USER_ENDPOINT}/${userId}`, {
                    method: 'DELETE'
                });

                if (response && response.ok) {
                    const updatedUsers = users.filter(user => user.userId !== userId);
                    setData(updatedUsers);

                    Swal.fire(
                        '¡Eliminado!',
                        'Usuario eliminado con éxito.',
                        'success'
                    );
                } else {
                    throw new Error(`Ha ocurrido un error al intentar eliminar el usuario con ID ${userId}`);
                }
            } catch (error) {
                console.error(error.message);
                Swal.fire(
                    'Error',
                    `${error.message}`,
                    'error'
                );
            }
        }
    }

    return (
        <>
            <div className='m-3'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                    <h4 className='mb-0'>Listado de usuarios:</h4>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline-secondary"
                    >← Volver
                    </button>
                </div>
                <div className='w-100 mt-3'>
                    {isLoading ?
                        <p>Cargando...</p>
                        : error ?
                            <p>Ha ocurido un error al cargar los usuario.</p>
                            :
                            <table className='table table-light table-striped border'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Email</th>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map(user => (
                                            <tr key={user.userId}>
                                                <td>{user.userId}</td>
                                                <td>{user.email}</td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm w-auto"
                                                        value={user.role}
                                                        disabled={user.userId == 1 && user.firstName == "Admin"}
                                                        onChange={(e) => handleRoleUpdate(user.userId, user.role, e.target.value)}
                                                    >
                                                        <option value={ROLES.USER}>Usuario</option>
                                                        <option value={ROLES.ADMIN}>Administrador</option>
                                                    </select>
                                                </td>
                                                {user.userId == 1
                                                    ? <td>No hay acciones disponibles</td>
                                                    : <td>
                                                        <div className="d-flex">
                                                            <button
                                                                className="btn"
                                                                onClick={() => handleRemove(user.userId)}
                                                            >❌</button>
                                                        </div>
                                                    </td>
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </>
    )
}

export default AdminUsersPage