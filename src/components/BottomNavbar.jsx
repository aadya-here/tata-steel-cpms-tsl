import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentCheckIcon, UserIcon, ListBulletIcon, RectangleGroupIcon, ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function BottomNavbar() {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: '100vw',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                // padding: 1,
                zIndex: 100,

            }}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                sx={{
                    justifyContent: 'space-evenly',
                    gap: 0,
                    '& .MuiBottomNavigationAction-root': {
                        minWidth: 'auto', // Allows buttons to shrink
                    },
                    // paddingY: 1,
                    height: "auto",
                    minHeight: 65
                }}
            >
                <BottomNavigationAction
                    label="Projects"
                    icon={<RectangleGroupIcon className="size-5" />}
                    sx={{ justifyContent: 'center' }}
                    onClick={() => { navigate("/projects") }}
                />
                <BottomNavigationAction
                    label="Logs"
                    icon={<ListBulletIcon className="size-5" />}
                    sx={{ justifyContent: 'center' }}
                    onClick={() => { navigate("/logs") }}
                />
                {/* <BottomNavigationAction
                    label="Dashboard"
                    icon={<ChartBarIcon className="size-5" />}
                    sx={{ justifyContent: 'center' }}
                    onClick={() => { navigate("/dashboard") }}
                /> */}
                <BottomNavigationAction
                    label="Forms"
                    icon={<DocumentCheckIcon className="size-5" />}
                    sx={{ justifyContent: 'center' }}
                    onClick={() => { navigate("/forms") }}
                />
                <BottomNavigationAction
                    label="Profile"
                    icon={<UserIcon className="size-5" />}
                    sx={{ justifyContent: 'center' }}
                    onClick={() => { navigate("/profile") }}
                />
            </BottomNavigation>
        </Box>
    );
}
