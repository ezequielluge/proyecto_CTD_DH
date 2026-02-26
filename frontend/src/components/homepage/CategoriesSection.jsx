import { useEffect, useState } from 'react'
import CategoryCard from './CategoryCard'
import "../../styles/categoryCard.css"
import { useFetch } from '../../hooks/useFetch'
import { CATEGORY_ENDPOINT } from '../../config/config'

const CategoriesSection = () => {
    const [categories, setCategories] = useState([]);

    const url = CATEGORY_ENDPOINT;
    const { data, isLoading, error } = useFetch(url);

    useEffect(() => {
        if (data && !isLoading && !error) {
            setCategories(data);
        }
    }, [data]);

    return (
        <section className='justify-content-left'>
            <h3 className='text-align-left mb-3'>Categorías</h3>
            {isLoading
                ? <p>Carando categorías...</p>
                : error
                    ? <p>Ha ocurrido un error al cargar las categorías.</p>
                    : categories.length == 0
                        ? <p>No hay categorías disponibles.</p>
                        :
                        <div>
                            {/* DESKTOP */}
                            <div className='d-none d-md-flex flex-row flex-nowrap gap-2 cardContainer'>
                                {categories.map(category => (
                                    <div key={category.categoryId}>
                                        <CategoryCard
                                            category={category}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* MOBILE */}
                            <div className='d-flex flex-column d-md-none w-100'>
                                {categories.map(category => (
                                    <div key={category.categoryId} className='card p-2 w-75 mb-2 ms-auto me-auto'>
                                        <p className='card-title fw-medium fs-5 m-0 text-center'>{`${category.name}`}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
            }

        </section>
    )
}

export default CategoriesSection