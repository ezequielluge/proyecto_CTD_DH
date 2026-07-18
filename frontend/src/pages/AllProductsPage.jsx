import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { PRODUCT_ENDPOINT, CATEGORY_ENDPOINT } from '../config/config';
import ProductCard from '../components/homepage/ProductCard';

const AllProductsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // States
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);

    // Filters
    const [searchTerm, setSearchTerm] = useState(searchParams.get("destination") || "");
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Fetchs
    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        error: categoriesError
    } = useFetch(CATEGORY_ENDPOINT);

    const {
        data: productsData,
        isLoading: isProductsLoading,
        error: productsError
    } = useFetch(PRODUCT_ENDPOINT);

    const totalInDB = productsData?.length || 0;

    useEffect(() => {
        if (categoriesData && !categoriesError) {
            setCategories(categoriesData);
        }
    }, [categoriesData, categoriesError]);

    useEffect(() => {
        if (productsData && !isProductsLoading && selectedCategories.length === 0) {
            setProducts(productsData);
        }
    }, [productsData, productsError])


    // Filter button
    const applyFilters = async () => {
        if (selectedCategories.length === 0) {
            const res = await fetch(PRODUCT_ENDPOINT);
            const data = await res.json();
            setProducts(data);
            return;
        }

        const ids = selectedCategories.join(',');
        const res = await fetch(`${PRODUCT_ENDPOINT}/filter/category?categoryIds=${ids}`);
        const data = await res.json();
        setProducts(data);
    };

    // Category initial filter
    useEffect(() => {
        const urlCat = searchParams.get("categoryId");
        if (urlCat) {
            const catId = parseInt(urlCat);
            setSelectedCategories([catId]);

            const fetchByCategory = async () => {
                try {
                    const res = await fetch(`${PRODUCT_ENDPOINT}/filter/category?categoryIds=${catId}`);
                    const data = await res.json();
                    setProducts(data);
                } catch (e) {
                    console.error(e);
                }
            };
            fetchByCategory();
        } else if (productsData) {
            setProducts(productsData);
        }
    }, [searchParams]);

    // Search bar filter
    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const results = products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.city.toLowerCase().includes(term)
        );
        setFilteredProducts(results);
        setVisibleCount(5);
    }, [searchTerm, products]);

    // Category handler
    const handleCategoryChange = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Clean filters while no products available
    const cleanFilters = async () => {
        setSearchTerm("");
        setSelectedCategories([]);
        navigate("/products", { replace: true });

        try {
            const res = await fetch(PRODUCT_ENDPOINT);
            const data = await res.json();
            setProducts(data);
        } catch (e) {
            console.error("Error al reiniciar los productos. ", e);
        }

    }

    if (categoriesError || productsError) navigate('/404');

    return (
        <div className="container-fluid mt-4 min-vh-100 px-lg-5">
            <div className="row g-4">
                {/* Filters */}
                <aside className="col-12 col-lg-3">
                    <div className="card shadow-sm p-3 w-100">
                        <h5 className="fw-bold mb-3">Filtros</h5>

                        {/* Search bar */}
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">BUSCAR POR DESTINO</label>
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">🔍</span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Ej: Buenos Aires..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories checklist */}
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">CATEGORÍAS</label>
                            <div className="overflow-auto pe-2" style={{ maxHeight: '300px' }}>
                                {isCategoriesLoading
                                    ? <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                                    : categories?.map(cat => (
                                        <div className="form-check mb-2" key={cat.categoryId}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`cat-${cat.categoryId}`}
                                                checked={selectedCategories.includes(cat.categoryId)}
                                                onChange={() => handleCategoryChange(cat.categoryId)}
                                            />
                                            <label className="form-check-label small" htmlFor={`cat-${cat.categoryId}`}>
                                                {cat.name}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Apply and clear filters row */}
                        <div className='d-flex flex-row flex-lg-column gap-2 w-100'>
                            <button className="flex-grow-1 w-100 btn btn-primary fw-bold" onClick={applyFilters}>
                                Aplicar filtros
                            </button>
                            <button className='flex-grow-1 w-100 btn btn-outline-danger fw-bold' onClick={cleanFilters}>
                                Reiniciar filtros
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Products list */}
                <main className="col-12 col-lg-9">
                    {isProductsLoading ? (
                        <div className="d-flex justify-content-center mt-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : (
                        <div className="ps-lg-3">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-bold m-0">Resultados de búsqueda</h4>
                                <span className="badge bg-light text-dark border fw-semibold py-2 px-3">
                                    {filteredProducts.length} de {totalInDB} alojamientos encontrados
                                </span>
                            </div>

                            <div className="col mb-3">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.slice(0, visibleCount).map(product => (
                                        <div className='mb-3' key={product.productId}>
                                            <ProductCard product={product} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-100 text-center py-5">
                                        <div className="bg-light p-5 rounded-4 border">
                                            <h3 className="text-muted">Oops...</h3>
                                            <p className="text-secondary">No encontramos nada que coincida con tu búsqueda.</p>
                                            <button
                                                className="btn btn-link text-decoration-none"
                                                onClick={cleanFilters}
                                            >Limpiar búsqueda</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Show more products button */}
                    {filteredProducts.length > visibleCount && (
                        <div className="text-center mt-4 mb-5">
                            <button
                                className="btn btn-outline-primary px-5 fw-bold shadow-sm"
                                onClick={() => setVisibleCount(prev => prev + 5)}
                            >
                                Mostrar más productos
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AllProductsPage;