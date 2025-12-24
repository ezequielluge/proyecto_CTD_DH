import React from 'react'
import { useState } from 'react'
import { DateRangePicker } from 'react-date-range';
import format from 'date-fns/format';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file


const HeroSection = () => {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false)
    const [date, setDate] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    });

    const toggleDatePicker = () => {
        setOpenDate((prev) => !prev);
    }

    const handleDateChange = (ranges) => {
        setDate(ranges.selection);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        console.log({ destination, date });
    }

    return (
        <section className='w-100 card flex justify-content-center p-5 pt-3 bg-light bg-opacity-75 shadow'>
            <h2 className='text-center' >Encontrá el destino de tu próximo viaje</h2>
            <div className='d-flex justify-content-center gap-2 mt-2'>
                    {/* Destinos */}
                    <select
                        className='form-select col d-inline btn border-dark bg-light'
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    >
                        <option value="" disabled>¿A dónde te gustaría ir?</option>
                        <option value="destino">Destino...</option>
                    </select>
                    { /* Selector de fechas */}
                    <div className='dropdown-center col d-inline btn border-dark bg-light'>
                        <span onClick={toggleDatePicker} className='' data-bs-toggle="dropdown" aria-expanded="false">
                            {`${format(date.startDate, 'MMM,dd,yyyy')} - ${format(date.endDate, 'MMM,dd,yyyy')}`}
                        </span>
                        <div className='dropdown-menu'>
                            <DateRangePicker
                                className='dropdown-item'
                                ranges={[date]}
                                onChange={handleDateChange}
                                minDate={new Date()}

                            />
                        </div>
                    </div>

                    { /* Botón Submit */}
                    <button
                        className='col btn btn-accent text-white'
                        onClick={handleSearch}
                        >Buscar
                    </button>

            </div>
        </section>
    )
}

export default HeroSection