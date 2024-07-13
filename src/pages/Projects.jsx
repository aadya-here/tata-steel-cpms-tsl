import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext'
import ProjectCard from '../components/info_cards/ProjectCard';
import supabase from '../supabase';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Title from '../components/ui_components/Title';
import Subheading from '../components/ui_components/Subheading';
import { useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SecondaryButton from '../components/ui_components/SecondaryButton';
import { Button } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';


const ProjectsPage = () => {
    const { userId } = useAuth();
    const [projects, setProjects] = useState([]);
    const [index, setIndex] = useState(0);
    const [filteredProjects, setFilteredProjects] = useState([]);
    // const [vendorName, setVendorName] = useState('');
    const isLargeScreen = useMediaQuery('(min-width:600px)');

    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            fetchProjects();
            // fetchVendorName();
        }
    }, [userId]);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('project_id', { ascending: false });

            if (error) {
                throw error;
            }

            setProjects(data);
            filterProjectsByTab(index, data);

        } catch (error) {
            console.error('Error fetching projects:', error.message);
        }
    };

    const filterProjectsByTab = (tab, projects) => {
        const statusMap = ['ongoing', 'upcoming', 'completed'];
        const filtered = projects.filter(project => project.status === statusMap[tab]);
        setFilteredProjects(filtered);
    };

    const handleTabChange = (event, value) => {
        setIndex(value);
        filterProjectsByTab(value, projects);
    };




    const handleProjectClick = (projectId) => {
        navigate(`${projectId}`);
        console.log('Project ID:', projectId);
    };


    return (
        <div className="w-full min-h-screen min-w-screen bg-blue-50 p-5 flex flex-col items-center">
            <Box
                sx={{
                    flexGrow: 1,
                    m: -2,
                    overflowX: 'hidden',
                }}
            >
                <Title text="Projects" />
                <Tabs
                    aria-label="Projects"
                    value={index}
                    onChange={handleTabChange}
                    size={isLargeScreen ? "md" : 'sm'}
                    sx={{ bgcolor: "#eff6ff" }}
                >
                    <TabList
                        sx={{
                            pt: 1,
                            justifyContent: 'center',
                            maxWidth: isLargeScreen ? '500px' : '300px',
                            [`&& .${tabClasses.root}`]: {
                                flex: 'initial',
                                bgcolor: '#eff6ff',
                                paddingX: 5,
                                paddingY: 2,
                                '&:hover': {
                                    bgcolor: '#eff6ff',
                                    paddingX: 5,
                                    paddingY: 2,
                                    borderRadius: 10
                                },
                                [`&.${tabClasses.selected}`]: {
                                    color: 'primary.plainColor',
                                    '&::after': {
                                        height: 2,
                                        borderTopLeftRadius: 3,
                                        borderTopRightRadius: 3,
                                        bgcolor: 'primary.700',
                                    },
                                },
                            },
                            '@media (max-width: 600px)': {
                                [`&& .${tabClasses.root}`]: {
                                    paddingX: 2,
                                    paddingY: 1,
                                },
                            },
                        }}
                    >
                        <Tab indicatorInset>
                            Ongoing{' '}
                            <Chip
                                size="sm"
                                variant="soft"
                                color={index === 0 ? 'primary' : 'warning'}
                            >
                                {projects.filter(project => project.status === 'ongoing').length}
                            </Chip>
                        </Tab>
                        <Tab indicatorInset>
                            Upcoming{' '}
                            <Chip
                                size="sm"
                                variant="soft"
                                color={index === 1 ? 'primary' : 'neutral'}
                            >
                                {projects.filter(project => project.status === 'upcoming').length}
                            </Chip>
                        </Tab>
                        <Tab indicatorInset>
                            Completed{' '}
                            <Chip
                                size="sm"
                                variant="soft"
                                color={index === 2 ? 'primary' : 'success'}
                            >
                                {projects.filter(project => project.status === 'completed').length}
                            </Chip>
                        </Tab>
                    </TabList>
                    <Box
                        sx={{
                            background: '#eff6ff',
                            boxShadow: 'none',
                        }}
                    >
                        <TabPanel value={0}>
                            {filteredProjects.map(project => (
                                <ProjectCard
                                    key={project.project_id}
                                    projectName={project.project_title}
                                    projectLocation={project.location}
                                    projectStatus={project.status}
                                    deliveryEndDate={project.delivery_end_date}
                                    projectId={project.project_id}
                                    type={project.type}
                                    onClick={() => handleProjectClick(project.project_id)}
                                />
                            ))}
                        </TabPanel>
                        <TabPanel value={1}>
                            {filteredProjects.map(project => (
                                <ProjectCard
                                    key={project.project_id}
                                    projectName={project.project_title}
                                    projectLocation={project.location}
                                    projectStatus={project.status}
                                    deliveryEndDate={project.delivery_end_date}
                                    projectId={project.project_id}
                                    type={project.type}

                                    onClick={() => handleProjectClick(project.project_id)}
                                />
                            ))}
                        </TabPanel>
                        <TabPanel value={2}>
                            {filteredProjects.map(project => (
                                <ProjectCard
                                    key={project.project_id}
                                    projectName={project.project_title}
                                    projectLocation={project.location}
                                    projectStatus={project.status}
                                    deliveryEndDate={project.delivery_end_date}
                                    projectId={project.project_id}
                                    type={project.type}

                                    onClick={() => handleProjectClick(project.project_id)}
                                />
                            ))}
                        </TabPanel>
                    </Box>
                </Tabs>

                <div className="fixed bottom-20 right-5">
                    <Button
                        sx={{ borderRadius: 100 }}
                        variant="solid"
                        color="primary"
                        className="w-12 h-12 flex items-center justify-center p-0"
                        onClick={() => { navigate(`new`) }}
                    >
                        <AddIcon />
                    </Button>
                </div>
            </Box>



        </div >
    );
};

export default ProjectsPage;
