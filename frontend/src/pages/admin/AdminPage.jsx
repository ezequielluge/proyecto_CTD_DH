import { NavLink } from 'react-router-dom'
import AdminPanelHeader from '../../components/admin/AdminPanelHeader'
import { ROUTES } from '../../config/paths'

const AdminPage = () => {
    return (
        <div>
            <section className='m-3'>
                <AdminPanelHeader title="Panel de administración" previousRoute={ROUTES.HOME} />

                <div className='d-flex gap-2'>
                    <button className='btn btn-secondary'>
                        <NavLink
                            className='text-reset text-decoration-none fs-5'
                            to={ROUTES.ADMIN.PRODUCTS}
                        >Lista de productos
                        </NavLink>
                    </button>
                    <button className='btn btn-secondary'>
                        <NavLink
                            className='text-reset text-decoration-none fs-5'
                            to={ROUTES.ADMIN.NEW_PRODUCT}
                        >Agregar un producto
                        </NavLink>
                    </button>
                    <button className='btn btn-secondary'>
                        <NavLink
                            className='text-reset text-decoration-none fs-5'
                            to={ROUTES.ADMIN.CATEGORIES}
                        >Lista de categorías
                        </NavLink>
                    </button>
                    <button className='btn btn-secondary'>
                        <NavLink
                            className='text-reset text-decoration-none fs-5'
                            to={ROUTES.ADMIN.NEW_CATEGORY}
                        >Agregar una categoría
                        </NavLink>
                    </button>
                    <button className='btn btn-secondary'>
                        <NavLink
                            className='text-reset text-decoration-none fs-5'
                            to={ROUTES.ADMIN.USERS}
                        >Usuarios
                        </NavLink>
                    </button>
                    <button className='btn btn-secondary'>
                        <NavLink
                            className='text-reset text-decoration-none fs-5'
                            to={ROUTES.ADMIN.FEATURES}
                        >Administrar caracteristicas
                        </NavLink>
                    </button>
                </div>
            </section>
        </div>
    )
}

export default AdminPage