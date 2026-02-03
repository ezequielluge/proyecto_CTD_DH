import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <div className='d-flex justify-content-center mt-5'>
            <div className='d-flex card w-50 p-5 pt-4 text-center justify-content-center'>
                <div className='mb-2'>
                    <h3 className='fw-bold'>ERROR 404</h3>
                    <p className='fs-4 fw-semibold'>Not found</p>
                </div>
                <div className='w-100'>
                    <button className='btn btn-light border w-50'>
                        <NavLink to='/' className='text-reset text-decoration-none fw-medium'>
                            <p className='m-2'>Volver a la página principal</p>
                        </NavLink>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage