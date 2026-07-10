import React, { useEffect, useState } from 'react';

import TopBar from '../../../components/DashBoards/TopBar';
import LeftPanel from '../../../components/DashBoards/MarketingDashboard/EmailTemplates/LeftPanel';
import RightPanel from '../../../components/DashBoards/MarketingDashboard/EmailTemplates/RightPanel';
import { templateService } from '../../../services/templateService';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplateDefault, setSelectedTemplateDefault] = useState({
    title: '',
    emailBody: '',
    emailSubject: '',
    description: '',
    status: 'Inactive',
    type: '',
    event: ''
  });
  const [handleTemplate, setHandleTemplate] = useState(true);

  const fetchTemplates = async () => {
    try {
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleUpdateTemplate = async (templateId, updatedFields) => {
    if (!updatedFields.title || !updatedFields.title.trim()) {
      alert("Title is required to save the template.");
      return;
    }

    try {
      let data;
      if (templateId) {
        // Update existing
        data = await templateService.update(templateId, updatedFields);
        setTemplates((prevTemplates) =>
          prevTemplates.map((template) =>
            template._id === templateId ? data : template
          )
        );
      } else {
        // Create new
        data = await templateService.create(updatedFields);
        setTemplates((prevTemplates) => [...prevTemplates, data]);
        // Optionally select the newly created template
        // setSelectedTemplate(data); 
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert("Failed to save template. Please try again.");
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await templateService.delete(id);
      setTemplates((prevTemplates) => prevTemplates.filter((template) => template._id !== id));

      if (selectedTemplate && selectedTemplate._id === id) {
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert("Failed to delete template.");
    }
  };

  useEffect(() => {
    if (selectedTemplate) {
      setHandleTemplate(false);
    }
  }, [selectedTemplate]);

  return (
    <div className="flex flex-col h-full">
      <TopBar title='Email Templates' placeholder='Search templates' />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          setSelectedTemplate={setSelectedTemplate}
          setHandleTemplate={setHandleTemplate}
          templates={templates}
          heading={'User Templates'}
        />

        {selectedTemplate ? (
          <RightPanel
            selectedTemplate={selectedTemplate}
            setTemplates={setTemplates}
            templates={templates}
            handleUpdateTemplate={handleUpdateTemplate}
            handleDeleteTemplate={handleDeleteTemplate}
          />
        ) : (
          <RightPanel
            selectedTemplate={selectedTemplateDefault}
            setTemplates={setTemplates}
            templates={templates}
            handleUpdateTemplate={handleUpdateTemplate}
          />
        )}
      </div>
    </div>
  );
};

export default EmailTemplates;
