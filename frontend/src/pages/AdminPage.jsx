import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom'

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const url = 'http://localhost:8080/products';

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error("Error cargando los productos.", err);
        }
    };


    const handleRemove = (id) => {
        Swal.fire({
            title: '¿Eliminar producto?',
            text: 'No podrás revertir esta acción.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(
                        `${url}/${id}`,
                        { method: 'DELETE' }
                    );
    
                    if (res.ok) {
                        setProducts(products.filter(p => p.productId !== id));
                        Swal.fire(
                            '¡Borrado!',
                            'El producto ha sido eliminado con éxito.',
                            'success'
                        )
                    }
    
                } catch (err) {
                    Swal.fire('Error', 'No se pudo eliminar.', 'error');
                }
            }
        });
    }

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
                    <h3 className='mb-2 fw-semibolder'>Panel de administración</h3>

                    <div className='d-flex gap-2'>
                        <button className='btn btn-secondary'>
                            <NavLink
                                className='text-reset text-decoration-none fs-5'
                                to={`/new`}
                            >Agregar un producto
                            </NavLink>
                        </button>
                    </div>
                </section>

                {/* Products list */}
                <section className='m-3'>
                    <h4 className='mb-2'>Listado de Productos</h4>
                    {loading ? <p>Cargando productos...</p> : (
                        products.length == 0 ? <p>No hay productos disponibles.</p> : (
                            <div className="row">
                                {products.map(product => (
                                    <div className="col-12 mb-4" key={product.productId}>
                                        <div className="card shadow-sm h-100 w-100">
                                            <div className="row g-0 w-100">
                                                {/* Image */}
                                                <div className="col-md-4">
                                                    <img
                                                        src={product.images && product.images[0]}
                                                        className="img-fluid rounded-start"
                                                        alt={product.name}
                                                        style={{ width: '100%', height: '100%', minHeight: '200px', objectFit: 'cover' }}
                                                    />
                                                </div>

                                                {/* Content */}
                                                <div className="col-md-8">
                                                    <div className="card-body d-flex flex-column h-100">
                                                        <div className="d-flex justify-content-between">
                                                            <h5 className="card-title">{product.name}</h5>
                                                            <span className="badge bg-info text-dark">ID: {product.productId}</span>
                                                        </div>

                                                        <p className="card-text text-muted mb-1">
                                                            <i className="bi bi-geo-alt"></i> {product.city} - {product.address}
                                                        </p>

                                                        <p className="card-text flex-grow-1">
                                                            {product.description}
                                                        </p>

                                                        <div className="d-flex justify-content-end gap-2 mt-3">
                                                            <button className="btn btn-outline-primary">
                                                                ✏️ Editar
                                                            </button>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => handleRemove(product.productId)}
                                                            >
                                                                🗑️ Eliminar Producto
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </section>
            </div>

        </>
    )
}

export default AdminPage