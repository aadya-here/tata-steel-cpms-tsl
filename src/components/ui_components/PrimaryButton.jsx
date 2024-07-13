import React from 'react';

const SubmitButton = ({ handleSubmit, text }) => {
    return (
        <div className="flex justify-center mt-4 mb-8">
            <button
                onClick={handleSubmit}
                className="bg-blue-950 text-white py-2 px-4 rounded w-full sm:w-full md:w-4/5 lg:w-full"
                style={{ maxWidth: '600px' }}
            >
                {text}
            </button>
        </div>
    );
};

export default SubmitButton;