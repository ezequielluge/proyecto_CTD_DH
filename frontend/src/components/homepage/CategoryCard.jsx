import { NavLink } from 'react-router-dom'
// import "../../styles/categoryCard.css"

const CategoryCard = ({ category }) => {
    return (
        <NavLink
            className="text-decoration-none"
            to={`/categories/${category.id}`}
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
                    {/* <p className='card-text'>Cantidad de productos: {`${category.productsQty}`}</p> */}
                </div>
            </div>
        </NavLink>
    )
}

export default CategoryCard