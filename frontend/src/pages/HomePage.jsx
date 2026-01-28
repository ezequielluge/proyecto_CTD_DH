import React from 'react'

import "../styles/homepage.css"

import HeroSection from '../components/homepage/HeroSection'
import CategoriesSection from '../components/homepage/CategoriesSection'
import ProductsSection from '../components/homepage/ProductsSection'

export const HomePage = () => {
    return (
        <>
            <section className='hero-section flex p-3 align-content-center shadow'>
                <HeroSection />
            </section>
            <div className='container-fluid text-left justify-content-center mt-4'>
                <CategoriesSection />
                <ProductsSection />
            </div>
        </>
    )
}
