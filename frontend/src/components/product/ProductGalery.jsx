import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '/src/hooks/useFetch';

const ProductGalery = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, error } = useFetch(`${import.meta.env.VITE_API_URL}/products/${id}`);

    return (
        <div className="container p-4 mt-4 mb-4 bg-light border rounded">
            {isLoading
                ? <h5>Cargando imágenes...</h5>
                : error
                    ? navigate('/404')
                    :
                    <>
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                            <h4 className='mb-0'>Galería</h4>
                            <button
                                onClick={() => navigate(-1)}
                                className="btn btn-outline-secondary"
                            >Volver
                            </button>
                        </div>
                        <div className="row g-3 w-100 h-100">
                            {data?.images.map((img, i) => (
                                <div key={i} className="col-md-4">
                                    <img src={img} className="img-fluid rounded" alt="galería" />
                                </div>
                            ))}
                        </div>
                    </>
            }

        </div>
    );
}

export default ProductGalery