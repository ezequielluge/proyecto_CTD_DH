import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NewProductPage = () => {
    const navigate = useNavigate();

    const [files, setFiles] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [status, setStatus] = useState('initial');

    const [nameError, setNameError] = useState("");

    const [productData, setProductData] = useState({
        name: '',
        address: '',
        city: '',
        description: '',
        categoryId: 1
    })

    const url = 'http://localhost:8080/products';

    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews])

    // #### Checks ####
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

    // #### Handlers ####
    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        });
        console.log(productData);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setStatus('initial');

        const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

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
            name: productData.name,
            address: productData.address,
            city: productData.city,
            description: productData.description,
            // TODO Implementar categoría
            // categoryId: productData.categoryId
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
                console.log("Success: ", data);
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
            console.error(err);
            setStatus('fail');
        }
    }

    return (
        <>
            <section className='m-3'>
                <h4>Nuevo producto</h4>

                <form
                    className="row g-3 mt-2"
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
                            placeholder='Ingresar el nombre del alojamiento'
                            onChange={handleChange}
                            onBlur={e => checkNameDuplicate(e.target.value)}
                        />
                        {nameError && <div className='invalid-feedback'>{nameError}</div> }
                    </div>
                    {/* Category dropdown selector */}
                    <div className="col-md-6">
                        <label htmlFor="categoryId" className="form-label" onChange={handleChange}>Categoría</label>
                        <select
                            id="categoryId"
                            className="form-select"
                            name='categoryId'
                        >
                            <option value="1">Hoteles</option>
                            <option value="2">Cabañas</option>
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
                            onChange={handleChange}
                        />
                    </div>
                    {/* Image upload */}
                    <div className="mb-3">
                        <label htmlFor="file" className="form-label">Imágenes del alojamiento</label>
                        <input
                            required
                            className="form-control"
                            type="file"
                            id="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>
                    {/* Previsualización de imágenes */}
                    <div className='row g-2 mb-3'>
                        {previews.map((previewUrl, index) => (
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
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={status === 'uploading'}
                            onClick={handleSubmit}
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