import React, { useEffect, useState } from 'react';
import FormCard from '../components/info_cards/FormCard';
import Title from '../components/ui_components/Title';
import supabase from '../supabase';

const FormsList = () => {
    const [forms, setForms] = useState([]);
    const [projects, setProjects] = useState({});
    const [formNames, setFormNames] = useState([]);

    useEffect(() => {
        const fetchFormsLogs = async () => {
            try {
                const { data, error } = await supabase
                    .from('forms_logs')
                    .select('*')
                    .order('created_on', { ascending: false });

                if (error) {
                    console.error('Error fetching forms_logs data:', error);
                } else {
                    setForms(data);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('project_id, project_title');

                if (error) {
                    console.error('Error fetching projects data:', error);
                } else {
                    const projectsMap = data.reduce((acc, project) => {
                        acc[project.project_id] = project.project_title;
                        return acc;
                    }, {});
                    setProjects(projectsMap);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        const fetchFormNames = async (formNumbers) => {
            try {
                const { data, error } = await supabase
                    .from('forms_list')
                    .select('*')
                    .in('form_num', formNumbers);

                if (error) {
                    console.error('Error fetching forms_list data:', error);
                } else {
                    setFormNames(data);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        const fetchData = async () => {
            await fetchFormsLogs();
            await fetchProjects();
        };

        fetchData().then(() => {
            if (forms.length > 0) {
                const formNumbers = forms.map(form => form.form_num);
                fetchFormNames(formNumbers);
            }
        });
    }, [forms]);

    return (
        <div className="w-full min-h-screen bg-blue-50 p-5 flex flex-col items-center pb-35">
            <Title text="Filled Forms" />
            <div className="my-0 p-0 flex flex-col space-y-3 w-full sm:w-4/5 md:w-4/5 lg:w-full">
                {forms.map((form) => {
                    const formName = formNames.find((fn) => fn.form_num === form.form_num)?.form_name || 'Unknown Form Name';
                    return (
                        <FormCard
                            key={form.form_log_id}
                            projectName={projects[form.project_id]}
                            date={new Date(form.created_on).toLocaleDateString()}
                            formStatus={form.approval_status}
                            formName={formName}
                            formLogId={form.form_log_id}
                            formId={form.form_id}
                            vendorId={form.vendor_id}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default FormsList;
