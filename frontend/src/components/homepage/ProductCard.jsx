import React from 'react'
import { NavLink } from 'react-router-dom'

const ProductCard = ({ product }) => {
    const { productId, name, description, address, city, images } = product;

    return (
        <div className="d-flex main-card" key={product.productId}>
            <div className="card shadow-sm h-100 w-100">
                <div className="row g-0">
                    {/* Image */}
                    <div className="col-12 col-md-4 productCard-image">
                        <img
                            src={images && images[0]}
                            className="img-fluid rounded-start"
                            alt={name}
                            style={{
                                width: '100%',
                                height: '100%',
                                minHeight: '200px',
                                maxHeight: '250px',
                                objectFit: 'cover'
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="col-12 col-md-8">
                        <div className="card-body d-flex flex-column h-100">
                            <div className="d-flex justify-content-between">
                                <h5 className="card-title text-truncate">{name}</h5>
                            </div>

                            <p className="card-text text-muted mb-1">
                                <i className="bi bi-geo-alt"></i> {city} - {address}
                            </p>

                            <p className="card-text text-truncate productCard-description">
                                {description}
                            </p>

                            <div className="mt-auto pt-3 d-flex justify-content-end">
                                <NavLink
                                    to={`/products/${productId}`}
                                    className='btn btn-outline-primary text-reset text-decoration-none'
                                >
                                    Reservar
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard