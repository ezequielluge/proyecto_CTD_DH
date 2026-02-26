import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CATEGORY_ENDPOINT, PRODUCT_ENDPOINT } from '../../config/config';
import { useFetch } from '../../hooks/useFetch';

const NewProductPage = () => {
    const navigate = useNavigate();

    const [files, setFiles] = useState(null);
    const [preview, setPreview] = useState([]);
    const [status, setStatus] = useState('initial');

    const [nameError, setNameError] = useState("");

    const [productData, setProductData] = useState({
        name: '',
        address: '',
        city: '',
        description: '',
        categoryId: 1
    })

    const url = PRODUCT_ENDPOINT;

    // Categories
    const categoriesUrl = CATEGORY_ENDPOINT;
    const [categories, setCategories] = useState(null);
    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        error: categoriesError
    } = useFetch(categoriesUrl);

    useEffect(() => {
        if (!isCategoriesLoading && !categoriesError) {
            setCategories(categoriesData);
        }
    }, [categoriesData])

    // Image preview
    useEffect(() => {
        return () => preview.forEach(url => URL.revokeObjectURL(url));
    }, [preview])

    // Validations
    const checkNameDuplicate = async (name) => {
        if (!name) return;

        try {
            const res = await fetch(`${url}/check-name?name=${encodeURIComponent(name)}`);
            const exists = await res.json();

            if (exists) {
                setNameError("Este nombre ya esta en uso.");
            } else {
                setNameError("");
            }

        } catch (e) {
            console.error("Error validando el nombre. ", e);
        }
    }

    // Handlers
    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setStatus('initial');

        const newPreview = selectedFiles.map(file => URL.createObjectURL(file));
        setPreview(newPreview);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!files) {
            alert("Por favor selecciona al menos una imagen.");
            return;
        }

        setStatus('uploading');
        const formData = new FormData();

        formData.append('product', new Blob([JSON.stringify({
            categoryId: productData.categoryId,
            name: productData.name,
            description: productData.description,
            address: productData.address,
            city: productData.city
        })], { type: 'application/json' }));

        Array.from(files).forEach((file) => {
            formData.append('files', file);
        });

        try {
            const res = await fetch(url, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setStatus('success');
                Swal.fire({
                    title: '¡Alojamiento agregado!',
                    text: 'El alojamiento ha sido agregado con éxito. Serás redireccionado en 3 segundos.',
                    timer: 3000
                });
                setTimeout(() => {
                    navigate('/administracion')
                }, 3000)
            } else {
                throw new Error('Error en la respuesta del servidor!');
            }
        }
        catch (err) {
            setStatus('fail');
        }
    }

    return (
        <>
            <section className='m-3'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                    <h4 className='mb-0'>Nuevo producto:</h4>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline-secondary"
                    >← Volver
                    </button>
                </div>

                <form
                    className="row g-3 mt-2"
                    onSubmit={handleSubmit}
                >
                    {/* Name input */}
                    <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Nombre del producto</label>
                        <input
                            required
                            type="text"
                            className={`form-control ${nameError ? 'is-invalid' : ''}`}
                            id="name"
                            name='name'
                            placeholder='Ingresar el nombre del alojamiento (máx. 80 caracteres)'
                            maxLength={80}
                            onChange={handleChange}
                            onBlur={e => checkNameDuplicate(e.target.value)}
                        />
                        {nameError && <div className='invalid-feedback'>{nameError}</div>}
                    </div>
                    {/* Category dropdown selector */}
                    <div className="col-md-6">
                        <label htmlFor="categoryId" className="form-label">Categoría</label>
                        <select
                            required
                            id="categoryId"
                            className="form-select"
                            name='categoryId'
                            disabled={isCategoriesLoading || categories?.length == 0}
                            onChange={handleChange}
                        >
                            <option value="">
                                {isCategoriesLoading
                                    ? "Cargando..."
                                    : categories?.length == 0
                                        ? "No existen categorías."
                                        : "Seleccione una categoría"
                                }
                            </option>
                            {categories != null && !isCategoriesLoading && categories.map((cat) => (
                                <option
                                    key={cat.categoryId}
                                    value={cat.categoryId}
                                >{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Address input */}
                    <div className="col-12">
                        <label htmlFor="address" className="form-label">Dirección</label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="address"
                            name='address'
                            placeholder="Calle numero"
                            onChange={handleChange}
                        />
                    </div>
                    {/* city input */}
                    <div className="col-12">
                        <label htmlFor="city" className="form-label">Ciudad</label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="city"
                            name='city'
                            placeholder='Ingresar la ciudad'
                            onChange={handleChange}
                        />
                    </div>
                    {/* Description text area */}
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Descripción</label>
                        <textarea
                            required
                            className="form-control"
                            id="description"
                            name='description'
                            rows="3"
                            placeholder='Máximo 2000 caracteres'
                            maxLength={2000}
                            onChange={handleChange}
                        />
                    </div>
                    {/* Image upload */}
                    <div className="mb-3">
                        <label htmlFor="file" className="form-label">Imágenes del alojamiento (máximo 9 imágenes)</label>
                        <input
                            required
                            className="form-control"
                            type="file"
                            id="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>
                    {/* Images preview */}
                    <div className='row g-2 mb-3'>
                        {preview.map((previewUrl, index) => (
                            <div key={index} className='col-3 position-relative'>
                                <img
                                    src={previewUrl}
                                    alt={`preview-${index}`}
                                    className='img-thumbnail'
                                    style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="col-12">
                        {categories?.length == 0
                            && <p className='fw-semibold'>¡Cree una categoría antes de continuar!</p>
                        }
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={status === 'uploading' || categories?.length == 0}
                        >
                            {status === 'uploading' ? 'Cargando...' : 'Agregar'}
                        </button>
                    </div>
                </form>
                {/* Status */}
                {status === 'fail' && <div className='alert alert-danger mt-3'>¡Error al guardar el alojamiento!</div>}
            </section>
        </>
    )
}

export default NewProductPage