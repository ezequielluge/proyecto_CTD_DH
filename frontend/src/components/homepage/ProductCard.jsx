import React from 'react'
import { NavLink } from 'react-router-dom'
import "/src/styles/productCard.css"

const ProductCard = ({ product }) => {
    const { productId, name, description, address, city, images } = product;

    return (
        <NavLink
            to={`/products/${productId}`}
            className='text-reset text-decoration-none'
        >
            <div className="col-12 main-card" key={product.productId}>
                <div className="card shadow-sm h-100 w-100">
                    <div className="row g-0 w-100">
                        {/* Image */}
                        <div className="col-md-4 productCard-image">
                            <img
                                src={product.images && product.images[0]}
                                className="img-fluid rounded-start"
                                alt={product.name}
                                style={{ width: '100%', height: '100%', minHeight: '200px', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Content */}
                        <div className="col-md-8">
                            <div className="card-body d-flex flex-column h-100">
                                <div className="d-flex justify-content-between">
                                    <h5 className="card-title">{product.name}</h5>
                                    {/* TODO Implementar rating */}
                                    {/* <span className="badge bg-info text-dark">Rating: {product.productId}</span> */}
                                </div>

                                <p className="card-text text-muted mb-1">
                                    <i className="bi bi-geo-alt"></i> {product.city} - {product.address}
                                </p>

                                <p className="card-text text-truncate productCard-description">
                                    {product.description}
                                </p>

                                {/* TODO Implementar servicios */}

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button className="btn btn-outline-primary">
                                        Reservar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default ProductCard