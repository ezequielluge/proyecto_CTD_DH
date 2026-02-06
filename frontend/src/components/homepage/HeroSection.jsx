import { useState } from 'react'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
const { RangePicker } = DatePicker;

const HeroSection = () => {
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState({
        startDate: null,
        endDate: null
    });
    const [search, setSearch] = useState({
        destination: null,
        date: null
    })

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

    const handleSearch = (e) => {
        e.preventDefault();

        if (destination && date) {
            setSearch({
                destination: `${destination}`,
                startDate: `${date.startDate}`,
                endDate: `${date.endDate}`
            });
            console.log(search);
        } else {
            console.error("No data input");
        }

    }

    return (
        <section className='w-100 card justify-content-center p-5 pt-3 bg-light bg-opacity-75 shadow'>
            <h2 className='text-center'>Encontrá el destino de tu próximo viaje</h2>
            
            <div className='d-flex flex-column flex-lg-row justify-content-center gap-2 mt-2'>    
                {/* Search bar */}
                <select
                    className='form-select flex-column btn border-secondary bg-light text-secondary'
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                >
                    <option value="" disabled>¿A dónde te gustaría ir?</option>
                    <option value="destino">Destino...</option>
                </select>

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