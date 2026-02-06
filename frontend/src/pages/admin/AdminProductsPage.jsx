import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch.js';
import Swal from 'sweetalert2';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);

    const url = `${import.meta.env.VITE_API_URL}/products`;
    const { data, isLoading, error } = useFetch(url);

    useEffect(() => {
        if(data) {
            setProducts(data);
        }
    }, [data])
    

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
                        setProducts(prevProducts => prevProducts.filter(p => p.productId !== id));
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
            <div className='m-3'>
                <h4 className='' >Alojamientos:</h4>
                <div className='w-100 mt-3'>
                    {isLoading
                        ? <p>Cargando productos...</p>
                        : error
                            ? <p>Ha ocurrido un error al cargar los productos: ${error}.</p>
                            :
                            <table className='table table-light table-striped border'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        products.map(product => (
                                            <tr key={product.productId}>
                                                <td>{product.productId}</td>
                                                <td>{product.name}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        {/* TODO Implementar edición */}
                                                        {/* <button
                                                            className="btn"
                                                        >✏️</button> */}
                                                        <button
                                                            className="btn"
                                                            onClick={() => handleRemove(product.productId)}
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

export default AdminProductsPage