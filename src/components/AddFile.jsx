import React, { useRef, useState } from 'react';
import SecondaryButton from "../components/ui_components/SecondaryButton";
import InputField from "../components/ui_components/InputField";
import supabase from '../supabase';
import moment from 'moment';
import { CircularProgress } from '@mui/joy';
import { useAuth } from '../context/authContext';

const AddFile = ({ projectId, logId, folderPath, onFileAdded, tag }) => {
    const { userId } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef(null);

    const handleAddFile = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            uploadFile(selectedFile);
        }
    };

    const uploadFile = async (file) => {
        try {
            setUploading(true);
            const filePath = `${folderPath}/${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from('files')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                throw uploadError;
            }

            const { data, error } = await supabase.storage
                .from('files')
                .getPublicUrl(filePath);

            // console.log(data, error);

            if (error) {
                throw error;
            }

            const { error: insertError } = await supabase
                .from('files')
                .insert([{
                    file_url: data.publicUrl,
                    log_id: logId,
                    project_id: projectId,
                    created_on: moment().format(),
                    created_by: userId,
                    caption: caption,
                    tag: tag,
                }]);

            if (insertError) {
                throw insertError;
            }

            setFile(data.publicUrl);
            alert('File uploaded and URL inserted successfully.');
            if (onFileAdded) {
                onFileAdded(data.publicUrl);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className='mt-2 '>
            <InputField
                placeholder="Description/Caption For File"
                value={caption}
                handleInputChange={setCaption}
            />
            <SecondaryButton text="Add File" onClick={handleAddFile} />
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".docx,.xlsx,.pptx,.pdf"
            />

            <p className='text-gray-500 flex flex-col justify-center items-center'>Accepted formats : .docx,.xlsx,.pptx,.pdf </p>
            {uploading && (
                <div className="flex justify-between items-center mt-4">
                    <p className="ml-2">Uploading...</p>
                    <CircularProgress size="sm" />
                </div>
            )}
        </div>
    );
};

export default AddFile;