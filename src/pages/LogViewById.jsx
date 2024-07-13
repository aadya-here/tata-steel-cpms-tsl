import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Assuming this custom hook exists
import AccordionGroup from '@mui/joy/AccordionGroup';
import Typography from '@mui/joy/Typography';
import supabase from '../supabase'; // Assuming supabase is configured
import CustomAccordion from '../components/CustomAccordian';
import TableComponent from '../components/TableComponent';
import Title from '../components/ui_components/Title';
import Subheading from '../components/ui_components/Subheading'
import PPEEntryCard from '../components/info_cards/PPECard';

const LogView = () => {
    const { logId } = useParams();
    const [logInfo, setLogInfo] = useState(null);
    const [toolboxTalk, setToolboxTalk] = useState([]);
    const [isTBExpanded, setIsTBExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [photosLoading, setPhotosLoading] = useState(true);


    const [firstAidForms, setFirstAidForms] = useState([]);
    const [fimForms, setFimForms] = useState([]);
    const [ppeChecklist, setPpeChecklist] = useState([]);

    const [isFirstAidExpanded, setIsFirstAidExpanded] = useState(false);
    const [isFIMExpanded, setIsFIMExpanded] = useState(false);
    const [isPPEExpanded, setIsPPEExpanded] = useState(false);

    const [projectName, setProjectName] = useState('');
    const [photos, setPhotos] = useState([]);



    useEffect(() => {
        fetchLogInfo();
        fetchPhotos('log');
    }, [logId]);

    const fetchLogInfo = async () => {
        try {
            setLoading(true);  // Ensure loading is set to true when starting the fetch process

            const { data, error } = await supabase
                .from('logs')
                .select('*')
                .eq('log_id', logId)
                .single();

            if (error) throw error;
            setLogInfo(data);

            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('project_title')
                .eq('project_id', data.project_id);

            if (projectError) throw projectError;


            if (projectData && projectData.length > 0) {
                setProjectName(projectData[0].project_title);
            } else {
                setProjectName(null);
            }

        } catch (error) {
            console.error('Error fetching log info:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchPpeChecklist = async () => {
        try {
            const { data, error } = await supabase
                .from('ppe_checklist')
                .select('*')
                .eq('log_id', logId);

            if (error) throw error;
            setPpeChecklist(data);
        } catch (error) {
            console.error('Error fetching PPE checklist:', error);
        }
    };



    const fetchToolboxTalk = async () => {
        try {
            const { data, error } = await supabase
                .from('tool_box_talk')
                .select('*')
                .eq('log_id', logId)
                .single();
            if (error) throw error;
            setToolboxTalk(data);
        } catch (error) {
            console.error('Error fetching Toolbox Talk:', error);
        }
    };

    const fetchFirstAidForms = async () => {
        try {
            const { data, error } = await supabase
                .from('first_aid')
                .select('*')
                .eq('log_id', logId);

            if (error) throw error;
            setFirstAidForms(data);
        } catch (error) {
            console.error('Error fetching First Aid Forms:', error);
        }
    };

    const fetchFIMForms = async () => {
        try {
            const { data, error } = await supabase
                .from('FIM_use')
                .select('*')
                .eq('log_id', logId);

            if (error) throw error;

            const parsedData = data.map(form => ({
                ...form,
                bar_dia_info: JSON.parse(form.bar_dia_info),
            }));

            setFimForms(parsedData);





        } catch (error) {
            console.error('Error fetching FIM Forms:', error);
        }
    };

    const fetchPhotos = async (tag) => {
        try {
            const { data, error } = await supabase
                .from('photos')
                .select('*')
                .eq('log_id', logId)
                .eq('tag', tag);

            if (error) throw error;

            setPhotos(data);
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setPhotosLoading(false);
        }
    };


    const handleAccordionToggle = (isExpanded, setIsExpanded, fetchFunction) => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            fetchFunction();
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div className='flex flex-col items-center justify-center min-h-screen pb-20'>

            <Title text={`Log ${logId} : ${projectName}`} />

            <Subheading text={`Created On: ${new Date(logInfo?.created_on).toLocaleDateString('en-GB')}`} />

            <div className='flex items-center justify-center w-3/4 p-0'>
                {logInfo ? (
                    <TableComponent data={logInfo} />
                ) : (
                    <Typography>No Data available</Typography>
                )}

            </div>

            <div className='flex items-center justify-center w-3/4 p-0'>
                {photos && photos.length > 0 ? (
                    photos.map((photo) => (
                        <div key={photo.id} className="flex flex-col items-center">
                            <img src={photo.photo_url} alt={photo.caption} className="w-3/5 mt-5 rounded-lg shadow-md" />
                            <Typography>{photo.caption}</Typography>
                        </div>
                    ))
                ) : (
                    <Typography>No Photos available</Typography>
                )}
            </div>

            <div className='flex flex-col items-center p-4 w-full'>

                <AccordionGroup color="primary" size="md" variant="plain" disableDivider sx={{ width: '95%', paddingX: 0, maxWidth: 800 }}>

                    <CustomAccordion
                        title="PPE Checklist"
                        isExpanded={isPPEExpanded}
                        onToggle={() => handleAccordionToggle(isPPEExpanded, setIsPPEExpanded, fetchPpeChecklist)}
                        content={
                            ppeChecklist.map(ppe => (
                                <PPEEntryCard entry={ppe} />
                            ))
                        }
                    />

                    <CustomAccordion
                        title="Toolbox Talk"
                        isExpanded={isTBExpanded}
                        onToggle={() => handleAccordionToggle(isTBExpanded, setIsTBExpanded, fetchToolboxTalk)}
                        content={
                            toolboxTalk ? (
                                <TableComponent data={toolboxTalk} />
                            ) : (
                                <Typography>No Toolbox Talk available</Typography>
                            )
                        }
                    />

                    <CustomAccordion
                        title="First Aid Forms"
                        isExpanded={isFirstAidExpanded}
                        onToggle={() => handleAccordionToggle(isFirstAidExpanded, setIsFirstAidExpanded, fetchFirstAidForms)}
                        content={
                            firstAidForms.length > 0 ? (
                                firstAidForms.map((form, index) => (
                                    <TableComponent key={index} data={form} />
                                ))
                            ) : (
                                <Typography>No First Aid Forms available</Typography>
                            )
                        }
                    />

                    <CustomAccordion
                        title="FIM Forms"
                        isExpanded={isFIMExpanded}
                        onToggle={() => handleAccordionToggle(isFIMExpanded, setIsFIMExpanded, fetchFIMForms)}
                        content={
                            fimForms.length > 0 ? (
                                fimForms.map((form, index) => (
                                    <TableComponent key={index} data={form} />
                                ))
                            ) : (
                                <Typography>No FIM Forms available</Typography>
                            )
                        }
                    />
                </AccordionGroup>
            </div>



        </div>
    );
};

export default LogView;
