import { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import { useDeleteWithAlert } from '../../hooks/useDeleteWithAlert';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_ENDPOINT, PRODUCT_ENDPOINT } from '../../config/config';
import Swal from 'sweetalert2';
import AdminPanelHeader from '../../components/admin/AdminPanelHeader';
import { api } from '../../services/api';

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);

    const url = CATEGORY_ENDPOINT;
    const { data, isLoading, error } = useFetch(url);
    const { data: productsData } = useFetch(PRODUCT_ENDPOINT);

    const { confirmDelete } = useDeleteWithAlert();

    useEffect(() => {
        if (data) {
            setCategories(data);
        }
    }, [data]);

    const handleRemove = (id) => {
        const productsUsingCategory = productsData?.filter(product =>
            product.categoryId == id
        ) || [];

        if (productsUsingCategory.length > 0) {
            const productsListHTML = productsUsingCategory.map(p =>
                `<li><strong>ID ${p.productId}:</strong> ${p.name}</li>`
            ).join('');

            Swal.fire({
                icon: 'error',
                title: 'No se puede eliminar',
                html: `
                            <div class="text-start">
                                <p>Esta categoría está siendo utilizada por los siguientes productos:</p>
                                <ul class="text-danger mb-3">
                                    ${productsListHTML}
                                </ul>
                            </div>
                        `,
                confirmButtonText: 'Entendido'
            });
            return;
        }

        confirmDelete({
            url: url,
            id: id,
            title: '¿Eliminar categoría?',
            onSuccess: (deleteId) => {
                setCategories(prev => prev.filter(cat => cat.categoryId !== deleteId));
            }
        });
    };

    // Update handler
    const handleUpdate = async (categoryId) => {
        const category = categories.find(cat => cat.categoryId === categoryId);

        Swal.fire({
            title: '<h4 class="fw-bold mt-2">Editar categoría</h4>',
            width: '700px',
            html: `
                <form id="edit-form" class="text-start px-3 container-fluid">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Nombre</label>
                        <input type="text" id="swal-name" class="form-control" value="${category.name || ''}">
                    </div>
    
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Descripción</label>
                        <textarea id="swal-description" class="form-control" rows="3">${category.description || ''}</textarea>
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
                // Recolección de datos
                const name = document.getElementById('swal-name').value;
                const description = document.getElementById('swal-description').value;
                const image = category.imageUrl;

                if (!name || !description) {
                    Swal.showValidationMessage('No deje campos en blanco.');
                    return false;
                }

                return {
                    categoryId,
                    name,
                    description,
                    image
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const formData = new FormData();
                    const categoryBlob = new Blob(
                        [JSON.stringify(result.value)],
                        { type: 'application/json' }
                    );
                    formData.append('category', categoryBlob);

                    const response = await api(`${url}/${categoryId}`, {
                        method: 'PUT',
                        body: formData
                    });

                    if (response.ok) {
                        const updatedCategory = await response.json();

                        setProducts(prev => prev.map(cat =>
                            cat.categoryId === categoryId ? updatedCategory : cat
                        ));

                        Swal.fire({
                            icon: 'success',
                            title: '¡Actualizado!',
                            text: 'La categoría se ha modificado correctamente.',
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
                <AdminPanelHeader title="Listado de categorias:" previousRoute={-1} />
                <div className='w-100 mt-3'>
                    {isLoading ?
                        <p>Cargando...</p>
                        : error ?
                            <p>Ha ocurido un error al cargar las categorías.</p>
                            : data.length == 0 ?
                                <p>No existen categorías.</p>
                                :
                                <table className='table table-light table-striped border'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>#Productos</th>
                                            <th>Descripcion</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            categories.map(category => (
                                                <tr key={category.categoryId}>
                                                    <td>{category.categoryId}</td>
                                                    <td>{category.name}</td>
                                                    <td>{category.productsCount}</td>
                                                    <td className='text-break'>{category.description}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <button
                                                                className="btn"
                                                                onClick={() => handleUpdate(category.categoryId)}
                                                            >✏️</button>
                                                            <button
                                                                className="btn"
                                                                onClick={() => handleRemove(category.categoryId)}
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

export default AdminCategoriesPage