import { useEffect, useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useNavigate, useParams, NavLink } from 'react-router-dom';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const url = `${import.meta.env.VITE_API_URL}/products/${id}`;
    const { data, isLoading, error } = useFetch(url);

    const [productData, setProductData] = useState({
        name: '',
        address: '',
        city: '',
        description: '',
        images: [],
        productId: id
    });

    useEffect(() => {
        if (!error && !isLoading) {
            setProductData(data);
        }
    }, [data]);

    return (
        <>
            {isLoading
                ? <p>Cargando...</p>
                : error ? navigate('/404')
                :
                <div className='container-fluid mt-4 w-75'>
                    {/* Header section */}
                    <section className='w-100'>
                        <div className='mb-3 p-4 bg-light rounded shadow-sm h-100'>
                            <div className='d-flex align-items-center justify-content-between mb-2 border-bottom pb-3'>
                                <h3 className='mb-0'>{productData.name}</h3>
                                {/* Desktop */}
                                <div className='d-none d-lg-block'>
                                    <button
                                        className='btn btn-outline-secondary'
                                        onClick={() => navigate(-1)}
                                        style={{ height: '40px' }}
                                    >← Volver</button>
                                </div>
                            </div>
                            <div className=''>
                                <p className='mb-1'><strong>Ciudad:</strong> {productData.city}</p>
                                <p className='mb-1'><strong>Dirección:</strong> {productData.address}</p>
                            </div>
                        </div>
                    </section>

                    {/* Images */}
                    <section className='container mb-3 p-4 bg-light rounded shadow-sm overflow-hidden'>
                        <h4 className='mb-2'>Galería de imágenes</h4>

                        {/* Desktop */}
                        <div className='d-none d-lg-block m-3'>
                            <div className='row g-2'>
                                <div className='col-12 col-md-6'>
                                    <img
                                        src={productData.images[0]}
                                        alt="Main image"
                                        className='img-fluid w-100 h-100'
                                        style={{ objectFit: 'cover', minHeight: '400px' }}
                                    />
                                </div>
                                <div className='col-12 col-md-6 d-none d-md-block'>
                                    <div className='row g-2 h-100'>
                                        {
                                            productData.images.slice(1, 5).map((img, index) => (
                                                <div key={index} className='col-6' style={{ height: '200px' }}>
                                                    <img
                                                        src={img}
                                                        alt={`Secondary image ${index}`}
                                                        className='img-fluid w-100 h-100'
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Mobile */}
                        <div className='d-block d-lg-none m-3'>
                            <img
                                src={productData.images[0]}
                                alt="Main image"
                                className='img-fluid w-100 h-100'
                                style={{ objectFit: 'cover' }}
                            />
                        </div>

                        {/* Galery button */}
                        <div className='d-flex justify-content-end mt-2'>
                            <NavLink to={`/products/${id}/images`}>
                                <button className='btn btn-outline-secondary'>Ver más</button>
                            </NavLink>
                        </div>

                    </section>

                    {/* Description */}
                    <section className='container mb-3 p-4 bg-lgiht rounded shadow-sm overflow-hidden'>
                        <h4 className='mb-3' >Acerca del alojamiento</h4>
                        <p>{productData.description}</p>
                    </section>

                </div>

            }
        </>
    )
}

export default ProductPage