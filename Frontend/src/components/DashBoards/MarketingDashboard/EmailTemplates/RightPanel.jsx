import { useEffect, useState } from "react"
import EmailTemplateEdit from "../EmailTempalateEdit"
import HeaderComponent from "../RightPanel/HeaderComponent"
import ActionButtonsComponent from "../RightPanel/ActionButtonsComponent"

const RightPanel = ({ selectedTemplate, handleUpdateTemplate, handleDeleteTemplate }) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [data, setData] = useState(selectedTemplate || {})

  // Update local state when prop changes (e.g. selecting a different template)
  useEffect(() => {
    setData(selectedTemplate || {})
    // If it's a new template (no ID), default to edit mode
    if (selectedTemplate && !selectedTemplate._id) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [selectedTemplate])


  const handleFieldChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const updatedFields = { ...data };

    // Ensure defaults
    if (!updatedFields.status) updatedFields.status = 'Inactive';
    if (!updatedFields.type) updatedFields.type = 'User'; // Capitalized as per array in LeftPanel? Backend schema allows String.

    // Pass ID if exists, otherwise undefined for Create
    handleUpdateTemplate(data._id, updatedFields);
    setIsEditMode(false);
  };


  const handleCancel = () => {
    setData(selectedTemplate || {})
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      handleDeleteTemplate(data._id)
    }
  }

  return (
    <div className="overflow-y-auto w-3/5 p-6 bg-white shadow-md border-l border-gray-200">
      <HeaderComponent
        data={data}
        isEditMode={isEditMode}
        onEdit={() => setIsEditMode(true)}
        onCancel={handleCancel}
        onChange={handleFieldChange}
        onDelete={handleDelete}
        // Hide delete button if it's a new template being created
        showDelete={!!data._id}
      />
      <EmailTemplateEdit
        template={data}
        isEditMode={isEditMode}
        onChange={handleFieldChange}
      />
      {isEditMode && (
        <ActionButtonsComponent
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}


export default RightPanel