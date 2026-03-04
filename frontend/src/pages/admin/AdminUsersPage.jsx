import React from 'react'
import { USERS_ENDPOINT } from '../../config/config'
import { useFetch } from '../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';

const AdminUsersPage = () => {
    const navigate = useNavigate();

    const url = USERS_ENDPOINT;
    const {
        data: users,
        isLoading,
        error
    } = useFetch(url);

    const handleUpdate = async (userId) => {

    }

    const handleRemove = async (userId) => {

    }

    return (
        <>
            <div className='m-3'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                    <h4 className='mb-0'>Listado de usuarios: (WIP)</h4>
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
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map(user => (
                                            <tr key={user.categoryId}>
                                                <td>{user.userId}</td>
                                                <td>{user.email}</td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <button
                                                            className="btn"
                                                            onClick={() => handleUpdate(user.userId)}
                                                        >✏️</button>
                                                        <button
                                                            className="btn"
                                                            onClick={() => handleRemove(user.userId)}
                                                        >❌</button>
                                                    </div>
                                                </td>
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