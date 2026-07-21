import { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

import { CATEGORY_ENDPOINT, FEATURES_ENDPOINT, PRODUCT_ENDPOINT } from '../../config/config.js';
import { useDeleteWithAlert } from '../../hooks/useDeleteWithAlert.js';
import { api } from '../../services/api.js';
import FeatureSelector from '../../components/admin/FeatureSelector.jsx';

import AdminPanelHeader from '../../components/admin/AdminPanelHeader.jsx'

const AdminProductsPage = () => {
    const MySwal = withReactContent(Swal);
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    
    const url = PRODUCT_ENDPOINT;
    const { confirmDelete } = useDeleteWithAlert();
    const { data, isLoading, error } = useFetch(url);
    const { data: categoriesData } = useFetch(CATEGORY_ENDPOINT);
    const { data: featuresData } = useFetch(FEATURES_ENDPOINT);

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

        MySwal.fire({
            title: <span className="fw-bold mt-2">Editar Producto</span>,
            width: '700px',
            html: (
                <form id="edit-form" className="text-start px-3 container-fluid">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label small fw-bold">Nombre</label>
                            <input type="text" id="swal-name" className="form-control" defaultValue={product.name || ''} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label small fw-bold">Categoría</label>
                            <select id="swal-category" className="form-select" defaultValue={product.categoryId}>
                                {categoriesData.map(cat => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold">Descripción</label>
                        <textarea id="swal-description" className="form-control" rows="3" defaultValue={product.description || ''} />
                    </div>

                    <div className="row">
                        <div className="col-md-8 mb-3">
                            <label className="form-label small fw-bold">Dirección</label>
                            <input type="text" id="swal-address" className="form-control" defaultValue={product.address || ''} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label small fw-bold">Ciudad</label>
                            <input type="text" id="swal-city" className="form-control" defaultValue={product.city || ''} />
                        </div>
                    </div>

                    {/* 5. AQUI INSERTAMOS NUESTRO COMPONENTE MODULAR */}
                    <FeatureSelector
                        featuresData={featuresData}
                        initialSelectedIds={product.featuresIds || []}
                    />
                </form>
            ),
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
                const images = product.images;

                const checkedNodes = document.querySelectorAll('.feature-checkbox:checked');
                const featuresIds = Array.from(checkedNodes).map(node => parseInt(node.value));

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
                    images,
                    featuresIds
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

                    const response = await api(`${url}/${productId}`, {
                        method: 'PUT',
                        body: formData
                    }, true);

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
                    } else {
                        throw new Error(response.body);
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
                }
            }
        });
    };

    return (
        <>
            <div className='m-3'>
                <AdminPanelHeader title="Listado de productos:" previousRoute={-1} />
                <div className='w-100 mt-3'>
                    {isLoading
                        ? <p>Cargando productos...</p>
                        : error
                            ? <p>Ha ocurrido un error al cargar los productos.</p>
                            : products?.length == 0
                                ? <p>No existen productos.</p>
                                :
                                <div>
                                    <h5>Total de productos: {products.length}</h5>
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
                                </div>
                    }
                </div>
            </div>
        </>
    )
}

export default AdminProductsPage