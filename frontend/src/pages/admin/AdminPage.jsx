import { NavLink } from 'react-router-dom'

const AdminPage = () => {
    return (
        <div>
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
                    <button className='btn btn-secondary'>
                        <NavLink
                            className='text-reset text-decoration-none fs-5'
                            to={`/administracion/categories`}
                        >Lista de categorías
                        </NavLink>
                    </button>
                    <button className='btn btn-secondary'>
                        <NavLink
                            className='text-reset text-decoration-none fs-5'
                            to={`/administracion/new-cat`}
                        >Agregar una categoría
                        </NavLink>
                    </button>
                </div>
            </section>
        </div>
    )
}

export default AdminPage