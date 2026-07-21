import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import { FEATURES_ENDPOINT, PRODUCT_ENDPOINT } from '../../config/config';
import AdminPanelHeader from '../../components/admin/AdminPanelHeader'
import { useDeleteWithAlert } from '../../hooks/useDeleteWithAlert';
import { api } from '../../services/api';

const MySwal = withReactContent(Swal);
library.add(fas);

const allSolidIcons = Array.from(new Set(Object.values(fas).map(icon => icon.iconName)));

const FeatureFormContent = ({ initialName, initialIcon }) => {
    const [iconValue, setIconValue] = useState(initialIcon || '');

    return (
        <div id="edit-form" className="text-start px-3 container-fluid">
            <div className="mb-3">
                <label className="form-label small fw-bold">Nombre de la característica</label>
                <input type="text" id="swal-name" className="form-control" defaultValue={initialName || ''} />
            </div>

            <div className="mb-3">
                <label className="form-label small fw-bold">Ícono (nombre FontAwesome)</label>
                <div className="input-group">
                    <span className="input-group-text bg-white" style={{ width: '50px', justifyContent: 'center' }}>
                        {iconValue
                            ? <FontAwesomeIcon icon={iconValue} />
                            : <i className="fa-solid fa-question text-muted"></i>}
                    </span>
                    <input
                        type="text"
                        id="swal-icon"
                        className="form-control"
                        value={iconValue}
                        onChange={(e) => setIconValue(e.target.value)}
                        placeholder="ej: house, wifi, swimming-pool..."
                    />
                </div>
            </div>

            <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Selecciona un ícono de la galería:</label>
                <div className="border rounded p-2 bg-light d-flex flex-wrap" style={{ maxHeight: '180px', overflowY: 'auto', gap: '8px' }}>
                    {allSolidIcons.map(iconName => (
                        <button
                            key={iconName}
                            type="button"
                            className={`btn btn-sm ${iconValue === iconName ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
                            title={iconName}
                            onClick={() => setIconValue(iconName)}
                        >
                            <FontAwesomeIcon icon={iconName} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};


const AdminFeaturesPage = () => {

    const [features, setFeatures] = useState([]);

    const url = FEATURES_ENDPOINT;
    const { data, isLoading, error, setData } = useFetch(FEATURES_ENDPOINT);
    const { data: productsData } = useFetch(PRODUCT_ENDPOINT);

    const { confirmDelete } = useDeleteWithAlert();

    useEffect(() => {
        if (!isLoading && !error)
            setFeatures(data);
    }, [data, error])

    const handleRemove = (id) => {
        const productsUsingFeature = productsData?.filter(product =>
            product.featuresIds && product.featuresIds.includes(id)
        ) || [];

        if (productsUsingFeature.length > 0) {
            const productsListHTML = productsUsingFeature.map(p =>
                `<li><strong>ID ${p.productId}:</strong> ${p.name}</li>`
            ).join('');

            Swal.fire({
                icon: 'error',
                title: 'No se puede eliminar',
                html: `
                    <div class="text-start">
                        <p>Esta característica está siendo utilizada por los siguientes productos:</p>
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
            title: "¿Eliminar característica?",
            onSuccess: (deleteId) => {
                setFeatures(prev => prev.filter(f => f.id !== deleteId));
            }
        });
    }

    const featureSwalAlert = ({ title, initialName = '', initialIcon = '', confirmButtonText }) => {
        return MySwal.fire({
            title: <span className="fw-bold mt-2">{title}</span>,
            width: '700px',
            html: <FeatureFormContent initialName={initialName} initialIcon={initialIcon} />,
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary px-4 py-2 me-2',
                cancelButton: 'btn btn-outline-secondary px-4 py-2'
            },
            preConfirm: () => {
                const name = document.getElementById('swal-name').value.trim();
                const iconValue = document.getElementById('swal-icon').value.trim();

                if (!name || !iconValue) {
                    Swal.showValidationMessage('No deje campos en blanco');
                    return false;
                }

                return {
                    name,
                    iconValue
                }
            }
        });
    }

    const handleUpdate = (id) => {
        const feature = features.find(f => f.id === id);

        featureSwalAlert({
            title: 'Editar Característica',
            initialName: feature.name,
            initialIcon: feature.icon,
            confirmButtonText: 'Guardar cambios'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payload = {
                    id: id,
                    name: result.value.name,
                    icon: result.value.iconValue
                };

                try {
                    const res = await api(`${url}/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(payload)
                    });

                    if (res.ok) {
                        const updatedFeature = await res.json();

                        setFeatures(prev => prev.map(f =>
                            f.id === id ? updatedFeature : f
                        ));

                        Swal.fire(
                            '¡Actualizado!',
                            'Caracteristica actualizada con éxito',
                            'success'
                        );

                    } else {
                        throw new Error(`Ha ocurrido un error al intentar actualizar la caracteristica. ID ${id}`);
                    }

                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        'Error',
                        error,
                        'error'
                    );
                }
            }
        })
    }

    const handleCreate = () => {
        featureSwalAlert({
            title: 'Nueva característica',
            confirmButtonText: 'Crear'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const payload = {
                    name: result.value.name,
                    icon: result.value.iconValue
                };

                try {
                    const res = await api(`${url}`, {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });

                    if (res.ok) {
                        const newFeature = await res.json();

                        setFeatures(prev => [...prev, newFeature]);

                        Swal.fire(
                            'Creada!',
                            'Característica creada con éxito.',
                            'success'
                        );
                    } else {
                        throw new Error('Ha ocurrido un error al intentar agregar la caracteristica');
                    }

                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        'Error',
                        error,
                        'error'
                    );
                }
            }
        });
    }

    return (
        <>
            <div className='m-3'>
                <AdminPanelHeader title="Caracteristicas:" previousRoute={-1} />
                <section className='w-100 mt-3'>
                    {isLoading
                        ? <p>Cargando características...</p>
                        : error ? <p>Ha ocurrido un error al cargar las características.</p>
                            : data.length == 0 ? <p>No hay caracteristicas existentes, por favor agregue una nueva.</p>
                                :
                                <div className='col'>
                                    <section className='d-flex justify-content-end mb-3'>
                                        <button
                                            onClick={() => handleCreate()}
                                            className="btn btn-primary"
                                        >Añadir nueva
                                        </button>
                                    </section>
                                    <table className='table table-light table-striped border'>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Nombre</th>
                                                <th>Icono</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {features.map(feature => (
                                                <tr key={feature.id}>
                                                    <td>{feature.id}</td>
                                                    <td>{feature.name}</td>
                                                    <td>
                                                        <FontAwesomeIcon icon={feature.icon} className="me-2" />
                                                        <span>{feature.icon}</span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <button
                                                                className="btn"
                                                                onClick={() => handleUpdate(feature.id)}
                                                            >✏️</button>
                                                            <button
                                                                className="btn"
                                                                onClick={() => handleRemove(feature.id)}
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
                </section>
            </div>
        </>
    )
}

export default AdminFeaturesPage