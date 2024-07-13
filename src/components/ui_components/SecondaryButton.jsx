import React from 'react';
import Button from '@mui/joy/Button';

const SecondaryButton = ({ onClick, text }) => {
    return (
        <div className="flex justify-center m-2 mb-0">
            <Button
                variant="outlined"
                className="rounded w-full sm:w-full md:w-4/5 lg:w-3/5"
                // Use outlined variant
                sx={{
                    borderRadius: 5,
                    backgroundColor: '#c1dbf7', // Add soft background color
                    borderColor: '#b2d3f7' // Soft border color
                }}
                onClick={onClick}
            >
                {text}
            </Button>
        </div>
    );
};

export default SecondaryButton;
