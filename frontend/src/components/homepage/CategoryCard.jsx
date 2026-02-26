import { NavLink, useNavigate } from 'react-router-dom'

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    return (
        <NavLink
            className="text-decoration-none"
            to={`/products?categoryId=${category.categoryId}`}
        >
            {/* DESKTOP */}
            <div className='d-none d-md-flex card categoryCard'>
                <img
                    className='card-img-top object-fit-cover'
                    src={category.imageUrl || "/src/assets/placeholder.png"}
                    alt="Category image"
                />

                <div className='card-body pt-2'>
                    <p className='card-title text-truncate fw-medium fs-5 mb-0'>{`${category.name}`}</p>
                </div>
            </div>
        </NavLink>
    )
}

export default CategoryCard