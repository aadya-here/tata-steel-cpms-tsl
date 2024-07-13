import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const DatePickerField = ({ label, date, setDate }) => {
    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
    };


    return (
        <div className="w-full flex justify-center">
            <div className="my-2 p-2 bg-blue-100 shadow-md rounded-md flex items-center space-x-4 w-full sm:w-4/5 md:w-4/5 lg:w-full" style={{ maxWidth: '600px' }}>

                <strong>{label} : </strong>
                <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="p-2 mt-2 w-full"
                />
            </div>
        </div>
    );
};

export default DatePickerField;
