import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CATEGORY_ENDPOINT } from '../../config/config';
import { api } from '../../services/api';

const NewCategoryPage = () => {
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null)
    const [status, setStatus] = useState('initial');

    const [categoryData, setCategoryData] = useState({
        name: '',
        description: '',
    })

    const url = CATEGORY_ENDPOINT;

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        }
    }, [preview])

    // #### Handlers ####
    const handleChange = (e) => {
        setCategoryData({
            ...categoryData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const img = e.target.files[0];

        if (img) {
            setFile(img);
            setStatus('initial');

            const previewUrl = URL.createObjectURL(img);
            setPreview(previewUrl);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Por favor selecciona una imagen.");
            return;
        }

        setStatus('uploading');
        const formData = new FormData();

        formData.append('category', new Blob([JSON.stringify({
            name: categoryData.name,
            description: categoryData.description
        })], { type: 'application/json' }));

        formData.append('file', file);

        try {
            const res = await api(url, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setStatus('success');
                Swal.fire({
                    title: '¡Categoría agregada!',
                    text: 'La categoría ha sido agregada con éxito. Serás redireccionado en 3 segundos.',
                    timer: 3000
                });
                setTimeout(() => {
                    navigate('/administracion')
                }, 3000)
            } else {
                throw new Error('¡Error en la respuesta del servidor!');
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
                    <h4 className='mb-0'>Nueva categoría:</h4>
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
                    <div className="col-md-12">
                        <label htmlFor="name" className="form-label">Nombre de la categoría</label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="name"
                            name='name'
                            placeholder='Ingresar el nombre de la categoría'
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
                            placeholder='Máximo 500 caracteres'
                            onChange={handleChange}
                        />
                    </div>
                    {/* Image upload */}
                    <div className="mb-3">
                        <label htmlFor="file" className="form-label">Imagen de la categoría</label>
                        <input
                            required
                            className="form-control"
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                        />
                    </div>
                    {/* Image preview */}
                    {preview &&
                        <div className='mb-3 w-25'>
                            <img
                                src={preview}
                                alt={`img-preview`}
                                className='img-thumbnail'
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    }

                    <div className="col-12">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={status === 'uploading'}
                        >
                            {status === 'uploading' ? 'Cargando...' : 'Agregar'}
                        </button>
                    </div>
                </form>
                {/* Status */}
                {status === 'fail' && <div className='alert alert-danger mt-3'>¡Error al guardar la categoría!</div>}
            </section>
        </>
    )
}

export default NewCategoryPage