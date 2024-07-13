import React, { useState, useEffect } from 'react';
import { Box, Card, Chip, Typography, Button } from '@mui/joy';
import DownloadIcon from '@mui/icons-material/Download';
import supabase from '../supabase';

const FileDisplaySection = ({ projectId, tag }) => {
    const [files, setFiles] = useState([]);

    const fetchFiles = async () => {
        try {
            const { data, error } = await supabase
                .from('files')
                .select('*')
                .eq('tag', tag)
                .eq('project_id', projectId);

            if (error) {
                throw error;
            }
            setFiles(data);
        } catch (error) {
            console.error('Error fetching files:', error.message);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [projectId, tag]);

    // console.log(files);

    const handleDownload = (fileUrl, fileName) => {
        // files.map((file, index) => (
        //     fileUrl = file.file_url
        // ))
        fetch(fileUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => alert('An error occurred while downloading the file.'));
    };

    return (
        <Box sx={{ mt: 2, width: '95%' }}>

            {files.map((file, index) => (
                <Card key={index} variant="outlined" sx={{ mt: 1, p: 2 }}>
                    <Chip size="sm" variant="outlined" color="primary">
                        {tag}
                    </Chip>
                    <p>{file.caption}</p>
                    <Button
                        startDecorator={<DownloadIcon />}
                        size="sm"
                        variant="soft"
                        color="primary"
                        onClick={() => handleDownload(file.file_url, `${file.caption || 'file'}.${file.file_url.split('.').pop()}`)}
                        sx={{ mt: 1 }}
                    >
                        Download
                    </Button>
                </Card>
            ))}
        </Box>
    );
};

export default FileDisplaySection;