import React from 'react';
import Divider from '@mui/joy/Divider';

const Title = ({ text }) => {
    return (
        <div className='w-full py-4'>
            <p className='text-center sm:text-3xl text-2xl font-bold text-gray-800 mt-6 mb-5'>
                {text}
            </p>
            <Divider sx={{ width: '50%', margin: 'auto' }} />
        </div>
    );
};

export default Title;
