import React from 'react';

const InputField = ({ icon, placeholder, handleInputChange }) => {
    return (
        <div className="w-full flex justify-center">
            <div className="my-2 p-2 bg-white shadow-md rounded-md flex items-center space-x-4 w-full sm:w-4/5 md:w-4/5 lg:w-full   " style={{ maxWidth: '600px' }}>
                {/* <img src={icon} alt="icon" className="w-6 h-6" /> */}
                <input
                    type="text"
                    placeholder={placeholder}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="border rounded w-full p-2 h-10"
                />
            </div>
        </div>
    );
};

export default InputField;
