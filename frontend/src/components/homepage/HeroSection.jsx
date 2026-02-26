import { useState } from 'react'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';

const { RangePicker } = DatePicker;

const HeroSection = () => {
    const navigate = useNavigate();

    const [destination, setDestination] = useState("");
    const [date, setDate] = useState({
        startDate: null,
        endDate: null
    });

    // Calendar
    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    }
    const handleDateChange = (values, dateStrings) => {
        if (values) {
            setDate({
                startDate: `${dateStrings[0]}`,
                endDate: `${dateStrings[1]}`
            })
        } else {
            setDate({ startDate: null, endDate: null })
        }
    }

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();

        // Sweetalert validation
        if (!destination) {
            Swal.fire({
                icon: 'warning',
                title: '¡Campos incompletos!',
                text: 'Por favor, ingrese una ciudad.',
                confirmButtonColor: '#2FBF71',
            });
            return;
        }

        // URL parameters
        const params = new URLSearchParams();
        params.append("destination", destination);
        if (date.startDate) params.append("startDate", date.startDate);
        if (date.endDate) params.append("endDate", date.endDate);
        
        navigate(`/products?${params.toString()}`);
    }

    return (
        <section className='w-100 card justify-content-center p-5 pt-3 bg-light bg-opacity-75 shadow'>
            <h2 className='text-center'>Encontrá el destino de tu próximo viaje</h2>
            
            <div className='d-flex flex-column flex-lg-row justify-content-center gap-2 mt-2'>
                {/* Search bar */}
                <div className="d-flex flex-column w-100 position-relative bg-light">
                    <input
                        type="text"
                        className='form-control py-2 border-secondary'
                        placeholder='¿A dónde te gustaría ir? (Ej: Buenos Aires, Neuquén...)'
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>

                <div className='d-flex flex-column flex-md-row w-100 gap-2 justify-content-center'>
                    { /* Date range picker */}
                    <RangePicker
                        className='w-100 border-secondary'
                        onChange={handleDateChange}
                        disabledDate={disabledDate}
                        format='YYYY-MM-DD'
                        placeholder={['Fecha inicio', 'Fecha fin']}
                        inputReadOnly={useMediaQuery({ query: '(max-width: 576px)' })}

                    />
                    { /* Submit */}
                    <button
                        className='col-12 col-md-4 btn btn-accent text-white fw-semibold border-secondary'
                        onClick={handleSearch}
                    >Buscar
                    </button>
                </div>
            </div>
            
        </section>
    )
}

export default HeroSection