import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom'

const AdminPage = () => {
    return (
        <>
            {/* Mobile */}
            <div className='d-block d-lg-none'>
                <section className='m-3'>
                    <h3>Panel de administrador no disponible!</h3>
                    <p>Por favor ingrese desde un dispositivo de escritorio.</p>
                </section>
            </div>
            {/* Desktop */}
            <div className='d-none d-lg-block'>
                <section className='m-3'>
                    <h3 className='mb-2 fw-semibold'>Panel de administración</h3>

                    <div className='d-flex gap-2'>
                        <button className='btn btn-secondary'>
                            <NavLink
                                className='text-reset text-decoration-none fs-5'
                                to={`/administracion/products`}
                            >Lista de productos
                            </NavLink>
                        </button>
                        <button className='btn btn-secondary'>
                            <NavLink
                                className='text-reset text-decoration-none fs-5'
                                to={`/administracion/new`}
                            >Agregar un producto
                            </NavLink>
                        </button>
                    </div>
                </section>
            </div>

        </>
    )
}

export default AdminPage