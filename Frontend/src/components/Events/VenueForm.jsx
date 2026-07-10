// frontend/src/components/Events/VenueForm.jsx

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; // For validation
import { createVenue } from '../../services/eventService';
import { toast } from 'react-toastify';
import { Loader, MapPin, Building, Save } from 'lucide-react';

// Validation Schema using Yup
const VenueSchema = Yup.object().shape({
  name: Yup.string().required('Venue name is required'),
  address: Yup.string().required('Full address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State/Province is required'),
  country: Yup.string().required('Country is required'),
  // We make lat/lng required as per the Mongoose model
  lat: Yup.number().required('Latitude is required').min(-90).max(90),
  lng: Yup.number().required('Longitude is required').min(-180).max(180),
});

// Initial values for the form fields
const initialValues = {
  name: '',
  address: '',
  city: '',
  state: '',
  country: '',
  lat: '',
  lng: '',
};

const VenueForm = ({ onVenueCreated }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    try {
      // API call to the backend POST /api/venues
      const response = await createVenue(values);
      toast.success(`Venue "${response.name}" created successfully!`);
      
      // Call the parent function to update the list/move to the next step
      onVenueCreated(response); 
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create venue.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  
  // NOTE: In a real app, you would integrate Google Maps API here
  // to autocomplete the address and get the Lat/Lng automatically.

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Building className="w-6 h-6 text-red-500" /> Create New Venue
      </h3>
      <p className="text-gray-600 mb-6 border-b pb-4">
        Define the location for your event. This venue will be saved under your account for future use.
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={VenueSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                <Field type="text" name="name" placeholder="E.g., Grand Exhibition Hall" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Address</label>
                <Field type="text" name="address" placeholder="123 Example St" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <Field type="text" name="city" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700">State / Province</label>
                <Field type="text" name="state" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                <ErrorMessage name="state" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <Field type="text" name="country" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Lat/Lng Note */}
              <div className="col-span-1 md:col-span-2 p-2 border-l-4 border-yellow-400 bg-yellow-50 rounded-md">
                 <p className="text-sm text-yellow-800">
                    <MapPin className="w-4 h-4 inline mr-1" /> For accurate geo-search, please enter the Latitude and Longitude.
                 </p>
              </div>

              {/* Latitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude (Lat)</label>
                <Field type="number" name="lat" step="any" placeholder="e.g., 43.6532" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                <ErrorMessage name="lat" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              {/* Longitude */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Longitude (Lng)</label>
                <Field type="number" name="lng" step="any" placeholder="e.g., -79.3832" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" />
                <ErrorMessage name="lng" component="div" className="text-red-500 text-xs mt-1" />
              </div>
              
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:bg-gray-400 flex items-center gap-2"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {loading ? 'Saving Venue...' : 'Save Venue'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VenueForm;