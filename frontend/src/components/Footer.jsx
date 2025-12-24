import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faXTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons'


export const Footer = () => {
    return (
        <footer className='position-static bottom-0 w-100 d-flex justify-content-between bg-footer p-2'>
            <div className='d-flex align-items-center gap-2 bg-footer-content'>
                <img
                    src="/src/assets/logo.png"
                    alt="Logo"
                    height='36'
                    width='auto'
                    className='rounded'
                />
                <h4 className='mb-0'>&copy;2025 Fast Booking</h4>
            </div>
            <div className='d-none d-sm-flex align-items-center'>
                <ul className='nav justify-content-end gap-3 me-3'>
                    <li className='nav-item fs-4'>
                        <a href="https://instagram.com/" target='blank' className='text-decoration-none text-reset'>
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                    </li>
                    <li className='nav-item fs-4'>
                        <a href="https://x.com/" target='blank' className='text-decoration-none text-reset'>
                            <FontAwesomeIcon icon={faXTwitter} />
                        </a>
                    </li>
                    <li className='nav-item fs-4'>
                        <a href="https://facebook.com/" target='blank' className='text-decoration-none text-reset'>
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}
