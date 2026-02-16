import React from 'react'
import ProductCard from "./ProductCard.jsx"
import { useState, useEffect } from 'react'
import { useFetch } from '../../hooks/useFetch.js';
import { PRODUCT_ENDPOINT } from '../../config/config.js';

const ProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const url = PRODUCT_ENDPOINT;
    const { data, isLoading, error } = useFetch(url);

    const productsPerPage = 10;

    useEffect(() => {
        if (!data?.length) return;

        setProducts(prev => {
            if (prev.length) return prev;
            return shuffleArray(data);
        });

    }, [data]);

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };


    const getPaginationRange = () => {
        const delta = 1;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const totalPages = Math.ceil(products.length / productsPerPage);

    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <section className='justify-content-left my-4'>
            <h3 className='text-align-left mb-3' >Explorá todos los alojamientos!</h3>
            {isLoading
                ? <h4>Cargando...</h4>
                : error
                    ? <h4>Ha ocurrido un error al cargar los productos.</h4>
                    : !data.length
                    ? <h4>No hay alojamientos disponibles.</h4>
                    :
                    <div>
                        <div className='row g-3'>
                            {currentProducts.map(product => (
                                <div key={product.productId} className="col-12 col-md-6" >
                                    <ProductCard
                                        product={product}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pages navbar */}
                        <nav className="d-flex justify-content-center mt-4 gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded text-white fw-medium disabled:opacity-50"
                            >
                                &larr; Anterior
                            </button>

                            <div className="d-flex gap-1">
                                {getPaginationRange().map((page, index) => (
                                    <button
                                        key={index}
                                        onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                        disabled={page === '...'}
                                        className={`px-3 py-1 rounded border fw-medium ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : page === '...'
                                                ? 'bg-transparent text-secondary border-none cursor-default'
                                                : 'bg-white text-secondary'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded text-white fw-medium disabled:opacity-50"
                            >
                                Siguiente &rarr;
                            </button>
                        </nav>
                    </div>
            }
        </section>
    )
}

export default ProductsSection