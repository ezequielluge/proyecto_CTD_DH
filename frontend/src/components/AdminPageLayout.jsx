import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminPageLayout = () => {
    return (
        <div className='d-flex flex-column min-vh-100'>
            {/* Mobile warning */}
            <div className='d-block d-lg-none'>
                <section className='m-3'>
                    <h3>Panel de administrador no disponible!</h3>
                    <p>Por favor ingrese desde un dispositivo de escritorio.</p>
                </section>
            </div>
            {/* Desktop */}
            <div className='d-none d-lg-block'>
                <main className='flex-grow-1'>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminPageLayout