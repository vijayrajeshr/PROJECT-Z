import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom'

import { FaSearch, FaSyncAlt, FaEdit, FaTrashAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import TopBar from '../../../components/DashBoards/TopBar';
import LeftPanel from '../../../components/DashBoards/MarketingDashboard/LeftPanel';
import RightPanel from '../../../components/DashBoards/MarketingDashboard/RightPanel';



const initialTemplates = [
  { id: 1, title: 'Terms of Use', emailSubject: 'wowwo', status: 'Active', emailBody: 'Hii Golu, ' },
  { id: 2, title: 'Privacy Policy', status: 'Active', emailBody: 'Hii Diwansoo, ' },
  { id: 3, title: 'Contact Us', status: 'Inactive', emailBody: 'Hii Diwanshu, ' },
  { id: 4, title: 'About Us', status: 'Active', emailBody: 'Hii aman, ' }
]


const TaxesAndCharges = () => {
  // const localStorageTemplates = JSON.parse(localStorage.getItem('templates')) || initialTemplates

  const [templates, setTemplates] = useState(initialTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState(null); // To store selected template data
  const [selectedTemplateDefault, setSelectedTemplateDefault] = useState({ title: '', emailBody: '' })
  const [handleTemplate, setHandleTemplate] = useState(true)

  // useEffect(() => {
  //   localStorage.setItem('templates', JSON.stringify(templates));
  // }, [templates])


  const handleUpdateTemplate = (templateId, updatedFields) => {

    setTemplates(prevTemplates =>
      prevTemplates.map(prevTemplate =>
        prevTemplate.id === templateId ? { ...prevTemplate, ...updatedFields } : prevTemplate
      )
    )

    if (selectedTemplate && selectedTemplate.id === templateId) {
      setSelectedTemplate(prev => ({ ...prev, ...updatedFields }))
    }
  }

    const handleDeleteTemplate = (id) => {
      
      setTemplates(prevTemplates => prevTemplates.filter(template => template.id !== id))

      setSelectedTemplate(null)
      setHandleTemplate(true)
    }

  useEffect(() => {
    if (selectedTemplate) {
      setHandleTemplate(false)
    }
  }, [selectedTemplate])



  const handleSave = () => {
    if (!selectedTemplateDefault.title.trim()) {
      alert("Title is required to save the template.");
      return;
    }
  
    const isNewTemplate = !templates.some(
      (template) => template.title === selectedTemplateDefault.title
    );
  
    if (isNewTemplate) {
      // Add new template
      setTemplates([...templates, { ...selectedTemplateDefault, id: Date.now() }]);
    } else {
      // Update existing template
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template.title === selectedTemplateDefault.title ? selectedTemplateDefault : template
        )
      );
    }
  
    setIsEditMode(false); // Exit edit mode
    setSelectedTemplateDefault({ title: '', emailBody: '' }); // Reset the form
  };



  return (
    <div className="flex flex-col h-screen">
      <TopBar title='Content Management System' placeholder='Search Content' />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel setSelectedTemplate={setSelectedTemplate}
          setHandleTemplate={setHandleTemplate} templates={templates} heading={'Contents'}/>

        {selectedTemplate ? (
          <RightPanel
            selectedTemplate={selectedTemplate}
            setTemplates={setTemplates} templates={templates}
            handleUpdateTemplate={handleUpdateTemplate}
            handleDeleteTemplate={handleDeleteTemplate} />
        ) : (
          <RightPanel selectedTemplate={selectedTemplateDefault}
            setTemplates={setTemplates} templates={templates}
            handleUpdateTemplate={handleUpdateTemplate} />
        )}

      </div>
    </div>
  )
}
export default TaxesAndCharges;




// const EmailTemplateManagement = () => {
//   const initialTemplates = [
//     { id: 1, title: 'Forgot Password', status: 'Active' },
//     { id: 2, title: 'Order Receive Alert', status: 'Active' },
//     { id: 3, title: 'Promotional Email', status: 'Inactive' },
//     { id: 4, title: 'User Added', status: 'Active' },
//   ];

//   const [templates, setTemplates] = useState(initialTemplates);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [newTemplate, setNewTemplate] = useState('');
//   const navigate = useNavigate()

//   const handleAddTemplate = () => {
//     if (newTemplate.trim() === '') {
//       alert('Template title cannot be empty');
//       return;
//     }
//     const newId = templates.length ? templates[templates.length - 1].id + 1 : 1;
//     const newTemplateObj = { id: newId, title: newTemplate, status: 'Active' };
//     setTemplates([...templates, newTemplateObj]);
//     setNewTemplate('');
//   };

//   const handleUpdateTemplate = (id) => {

//     navigate('/email-tempalate-edit')
//   };

//   const handleDeleteTemplate = (id) => {
//     if (window.confirm('Are you sure you want to delete this template?')) {
//       setTemplates((prev) => prev.filter((template) => template.id !== id));
//     }
//   };

//   const toggleStatus = (id) => {
//     setTemplates((prev) =>
//       prev.map((template) =>
//         template.id === id
//           ? { ...template, status: template.status === 'Active' ? 'Inactive' : 'Active' }
//           : template
//       )
//     );
//   };

//   const columns = [
//     {
//       name: 'Sr. No.',
//       selector: (row, index) => index + 1,
//       width: '10%',
//       sortable: false,
//       cell: (row, index) => <div className="text-left">{index + 1}</div>,
//     },
//     {
//       name: 'Title (En)',
//       selector: (row) => row.title,
//       width: '40%',
//       sortable: true,
//       cell: (row) => <div className="text-left">{row.title}</div>,
//     },
//     {
//       name: 'Status',
//       selector: (row) => row.status,
//       width: '20%',
//       sortable: true,
//       center: true,
//       cell: (row) => (
//         <div
//           className={`${
//             row.status === 'Active' ? 'text-green-500' : 'text-red-500'
//           } font-medium`}
//         >
//           {row.status}
//         </div>
//       ),
//     },
//     {
//       name: 'Actions',
//       width: '30%',
//       sortable: false,
//       right: true,
//       cell: (row) => (
//         <div className="flex justify-end items-center gap-2">
//           <button
//             className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
//             onClick={() => handleUpdateTemplate(row.id)}
//           >
//             <FaEdit />
//           </button>
//           <button
//             className="p-2 text-white bg-red-500 rounded hover:bg-red-600"
//             onClick={() => handleDeleteTemplate(row.id)}
//           >
//             <FaTrashAlt />
//           </button>
//           <button
//             className={`p-2 rounded ${
//               row.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
//             }`}
//             onClick={() => toggleStatus(row.id)}
//           >
//             {row.status === 'Active' ? <FaToggleOn /> : <FaToggleOff />}
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const filteredTemplates = templates.filter((template) =>
//     template.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Email Template Management</h1>

//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="New Template Title"
//           className="px-2 py-1 border rounded"
//           value={newTemplate}
//           onChange={(e) => setNewTemplate(e.target.value)}
//         />
//         <button
//           onClick={handleAddTemplate}
//           className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
//         >
//           Add Template
//         </button>
//       </div>

//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center gap-2">
//           <input
//             type="text"
//             placeholder="Search templates..."
//             className="px-2 py-1 border rounded"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
//             <FaSearch />
//           </button>
//         </div>
//         <button
//           className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//           onClick={() => window.location.reload()}
//         >
//           <FaSyncAlt />
//         </button>
//       </div>

//       <DataTable
//         columns={[...columns]}
//         data={filteredTemplates}
//         pagination
//         highlightOnHover
//         striped
//       />
//     </div>
//   );
// };

