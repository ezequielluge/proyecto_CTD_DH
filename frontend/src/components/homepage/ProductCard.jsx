import React from 'react'
import { NavLink } from 'react-router-dom'
import "/src/styles/productCard.css"

const ProductCard = ({ product }) => {
    const { id, name, location, rating, services, images } = product;

    return (
        <NavLink
            to={`/products/${id}`}
            className='text-decortation-none text-dark'
        >
            <div className='card w-100 shadow-sm'>
                <div className='row g-0'>
                    <div className='col-4 productCard-image'>
                        <img
                            className='img-fluid h-100 rounded-start object-fit-cover'
                            src={images?.[0] || "../../src/assets/placeholder.png"}
                            alt="Product image"
                        />
                    </div>
                    
                    <div className='col-8'>
                        <div className="card-body py-2">
                            <h6 className="card-title mb-1">{name}</h6>

                            <p className="card-text small text-muted mb-1">
                                {location}
                            </p>

                            <p className="card-text small mb-1">
                                ⭐ <strong>{rating}</strong>
                            </p>

                            <div className="d-flex flex-wrap gap-1">
                                {services.slice(0, 3).map((service, index) => (
                                    <span
                                        key={index}
                                        className="badge bg-light text-secondary border"
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}

export default ProductCard