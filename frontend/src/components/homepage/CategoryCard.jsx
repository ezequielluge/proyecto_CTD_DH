import { NavLink } from 'react-router-dom'
import "../../styles/categoryCard.css"

const CategoryCard = ({ category }) => {
    return (
        <NavLink
            className="text-decoration-none"
            to={`/categories/${category.id}`}
        >
            <div className='card categoryCard'>
                <img
                    className='card-img-top object-fit-cover'
                    src={category.imageUrl || "/src/assets/placeholder.png"}
                    alt="Category image"
                />

                <div className='card-body'>
                    <h5 className='card-title'>{`${category.name}`}</h5>
                    <p className='card-text'>Cantidad de productos: {`${category.productsQty}`}</p>
                </div>
            </div>

        </NavLink>
    )
}

export default CategoryCard