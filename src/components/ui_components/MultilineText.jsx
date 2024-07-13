import React from 'react';
import { Input, Textarea, TextField } from '@mui/joy';
import PropTypes from 'prop-types';

const MultiTextField = ({ label, value, handleInputChange }) => {
    return (
        <div className="w-full flex justify-center">
            <div className="my-2 p-2 bg-white shadow-md rounded-md flex items-center space-x-4 w-full sm:w-4/5 md:w-4/5 lg:w-full" style={{ maxWidth: '600px' }}>
                <Textarea
                    minRows={2}
                    value={value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={label}
                    sx={{ width: '100%' }}
                />

            </div>
        </div>
    );
};


export default MultiTextField;