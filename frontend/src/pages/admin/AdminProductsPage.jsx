import { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch.js';
import Swal from 'sweetalert2';
import { CATEGORY_ENDPOINT, PRODUCT_ENDPOINT } from '../../config/config.js';
import { useNavigate } from 'react-router-dom';
import { useDeleteWithAlert } from '../../hooks/useDeleteWithAlert.js';

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const url = PRODUCT_ENDPOINT;
    const { confirmDelete } = useDeleteWithAlert();

    const { data, isLoading, error } = useFetch(url);

    useEffect(() => {
        if (data && !isLoading) {
            setProducts(data);
        }
    }, [data, error]);

    // Remove handler
    const handleRemove = (id) => {
        confirmDelete({
            url: url,
            id: id,
            title: '¿Eliminar producto?',
            onSuccess: (deleteId) => {
                setProducts(prev => prev.filter(prod => prod.productId !== deleteId));
            }
        });
    }

    // Update handler
    const handleUpdate = async (productId) => {
        const product = products.find(p => p.productId === productId);

        const categoryOptions = categoriesData.map(cat =>
            `<option value="${cat.categoryId}" ${cat.categoryId === product.categoryId ? 'selected' : ''}>
            ${cat.name}
        </option>`
        ).join('');

        Swal.fire({
            title: '<h4 class="fw-bold mt-2">Editar Producto</h4>',
            width: '700px',
            html: `
            <form id="edit-form" class="text-start px-3 container-fluid">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label small fw-bold">Nombre</label>
                        <input type="text" id="swal-name" class="form-control" value="${product.name || ''}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label small fw-bold">Categoría</label>
                        <select id="swal-category" class="form-select">
                            ${categoryOptions}
                        </select>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label small fw-bold">Descripción</label>
                    <textarea id="swal-description" class="form-control" rows="3">${product.description || ''}</textarea>
                </div>

                <div class="row">
                    <div class="col-md-8 mb-3">
                        <label class="form-label small fw-bold">Dirección</label>
                        <input type="text" id="swal-address" class="form-control" value="${product.address || ''}">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label small fw-bold">Ciudad</label>
                        <input type="text" id="swal-city" class="form-control" value="${product.city || ''}">
                    </div>
                </div>
            </form>
        `,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            cancelButtonText: 'Cancelar',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary px-4 py-2 me-2',
                cancelButton: 'btn btn-outline-secondary px-4 py-2'
            },
            preConfirm: () => {
                const name = document.getElementById('swal-name').value;
                const categoryId = document.getElementById('swal-category').value;
                const description = document.getElementById('swal-description').value;
                const address = document.getElementById('swal-address').value;
                const city = document.getElementById('swal-city').value;
                const images = products.images;

                if (!name || !description || !address || !city) {
                    Swal.showValidationMessage('No deje campos en blanco.');
                    return false;
                }

                return {
                    productId,
                    name,
                    categoryId: parseInt(categoryId),
                    description,
                    address,
                    city,
                    images
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    const productBlob = new Blob(
                        [JSON.stringify(result.value)],
                        { type: 'application/json' }
                    );
                    formData.append('product', productBlob);

                    const response = await fetch(`${url}/${productId}`, {
                        method: 'PUT',
                        body: formData
                    });

                    if (response.ok) {
                        const updatedProduct = await response.json();

                        setProducts(prev => prev.map(p =>
                            p.productId === productId ? updatedProduct : p
                        ));

                        Swal.fire({
                            icon: 'success',
                            title: '¡Actualizado!',
                            text: 'El producto se ha modificado correctamente.',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }
                } catch (error) {
                    Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
                }
            }
        });
    };

    return (
        <>
            <div className='m-3'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                    <h4 className='mb-0'>Listado de productos:</h4>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline-secondary"
                    >← Volver
                    </button>
                </div>
                <div className='w-100 mt-3'>
                    {isLoading
                        ? <p>Cargando productos...</p>
                        : error
                            ? <p>Ha ocurrido un error al cargar los productos.</p>
                            : products?.length == 0
                                ? <p>No existen productos.</p>
                                :
                                <table className='table table-light table-striped border'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Categoría</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            products.map(product => (
                                                <tr key={product.productId}>
                                                    <td>{product.productId}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.categoryName}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <button
                                                                className="btn"
                                                                onClick={() => handleUpdate(product.productId)}
                                                            >✏️</button>
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