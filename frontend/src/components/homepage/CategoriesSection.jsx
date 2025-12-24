import React from 'react'
import CategoryCard from './CategoryCard'
import { NavLink } from 'react-router-dom'
import "../../styles/categoryCard.css"

const CategoriesSection = () => {

    // EJEMPLOS HAY QUE HACER EL FETCH
    const categories = [
        {
            "id": 1233544,
            "name": "Playas",
            "productsQty": 43,
            "imageUrl": "https://imgs.search.brave.com/I_KwE-jZNIBiMMn62zQS2IF-m2a9fJLugTHtEPmVAfY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI2/NDE0NDIyOC9lcy9m/b3RvL3Bhbm9yYW1h/LWElQzMlQTlyZW8t/ZGUtc3Vuc2V0LWJl/YWNoLW1hbGRpdmFz/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1Pb3lGZnBMdDQw/OHk3OXp2MExFa2M5/eFJuNXdIS3dPb2hW/eUdNLVFYRVhNPQ"
        },
        {
            "id": 1287635,
            "name": "Cabañas",
            "productsQty": 23,
            "imageUrl": "https://imgs.search.brave.com/U1tr97cBbtuewPjU5blADh7diZVFe06WESGbzQMPv6o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM1/MDg5MTM1NC9waG90/by9sYWdvLWVwdXkl/QzMlQTluLWNodWJ1/dC1wYXRhZ29uaWEt/YXJnZW50aW5hLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz03/Wlk1OUN2TUJfQmFr/OHotNXBaLUpLeWw0/Rl9ldlBsM0p6OERB/U1JHci1zPQ"
        },
        {
            "id": 12765438,
            "name": "Categoria 3",
            "productsQty": 95,
            "imageUrl": ""
        },
        {
            "id": 124238,
            "name": "Categoria 4",
            "productsQty": 12,
            "imageUrl": ""
        },
        {
            "id": 122323,
            "name": "Categoria 5",
            "productsQty": 19,
            "imageUrl": ""
        },
        {
            "id": 1243549,
            "name": "Categoria 6",
            "productsQty": 13,
            "imageUrl": ""
        }
    ]
    // FETCH:
    /* 
    useEffect(() => {
      fetch("/api/categories")
        .then(res => res.json())
        .then(data => setCategories(data));
    }, []);
    */

    return (
        <section className='justify-content-left'>
            <h3 className='text-align-left' >Categorías</h3>
            <div className='d-flex flex-row flex-nowrap gap-2 cardContainer'>
                {categories.map(category => (
                    <div key={category.id}>
                        <CategoryCard
                            category={category}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default CategoriesSection