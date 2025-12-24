import React from 'react'
import ProductCard from "./ProductCard.jsx"
import { useState, useEffect} from 'react'

const ProductsSection = () => {

  // EJEMPLOS HAY QUE HACER EL FETCH
  const products = [
    {
      "id": 12273456734,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.8,
      "services": [],
      "images": []
    },
    {
      "id": 1232275,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 3.7,
      "services": [],
      "images": []
    },
    {
      "id": 12794756,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 3.6,
      "services": [],
      "images": []
    },
    {
      "id": 1224145,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.2,
      "services": [],
      "images": []
    },
    {
      "id": 1264123,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 5.0,
      "services": [],
      "images": []
    },
    {
      "id": 124743564,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.9,
      "services": [],
      "images": []
    },
    {
      "id": 1237534,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.3,
      "services": [],
      "images": []
    },
    {
      "id": 16375734,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.5,
      "services": [],
      "images": []
    },
    {
      "id": 263564734,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.5,
      "services": [],
      "images": []
    },
    {
      "id": 298765434,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.5,
      "services": [],
      "images": []
    },
    {
      "id": 2824324634,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.5,
      "services": [],
      "images": []
    },
    {
      "id": 253354674,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.5,
      "services": [],
      "images": []
    },
    {
      "id": 234657834,
      "name": "Nombre",
      "location": "Ubicación",
      "rating": 4.5,
      "services": [],
      "images": []
    },
  ]

  const [recommend, setRecommend] = useState([]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (!products?.length) return;

    setRecommend(prev => {
      if (prev.length) return prev;
      return shuffleArray(products).slice(0,10);
    })

  }, [products])

  return (
    <section className='justify-content-left my-4'>
      <h3 className='text-align-left' >Explorá todos los alojamientos!</h3>
      <div className='row g-3'>
        {recommend.map(product => (
          <div key={product.id} className="col-12 col-md-6" >
            <ProductCard
              product={product}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductsSection