import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminPanelHeader = ({title, previousRoute}) => {
    const navigate = useNavigate();

    return (
        <div className='d-flex justify-content-between align-items-center mb-4'>
            <h4 className='mb-0'>{title}</h4>
            <button
                onClick={() => navigate(previousRoute)}
                className="btn btn-outline-secondary"
            >← Volver
            </button>
        </div>
    )
}

export default AdminPanelHeader