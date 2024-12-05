import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MultiSelect } from '../components/MultiSelect';
import { useAuth } from '../context/AuthContext';
import type { Facility, FacilityType, Insurance, Service } from '../types';

const facilityTypes: FacilityType[] = [
  'Skilled Nursing Facility',
  'Short Term Rehab',
  'Assisted Living Facility',
  'Inpatient Rehabilitation Unit',
  'Home Services Provider',
  'Long Term Acute Care Hospital (LTACH)'
];

const insurances: Insurance[] = [
  'Medicaid',
  'Medicare',
  'Blue Cross & Blue Shield',
  'Neighborhood Health',
  'UnitedHealthcare',
  'Tufts Health Plan',
  'Aetna',
  'Harvard Pilgrim',
  'Cigna',
  'AmeriHealth Caritas',
  'Molina',
  'Oscar',
  'Other'
];

const services: Service[] = [
  'OT',
  'PT',
  'Speech Therapy',
  'Wound Care',
  'Medication Administration',
  'IV Medication Administration',
  'Social Services',
  'Nutrition Services',
  'Palliative & Hospice Care',
  'Behavioral Health',
  'Mobility Assistance',
  'ADL Assistance',
  '24-hour Nursing',
  'Memory Care',
  'Oxygen Therapy',
  'Transportation Services & Facility Transfers',
  'Interpreter Services',
  'Case Management'
];

const emptyFacility: Facility = {
  id: '',
  name: '',
  type: [],
  location: '',
  phone: '',
  fax: '',
  contact: {
    name: '',
    email: '',
    phoneExt: '',
  },
  imageUrl: '',
  insurances: [],
  services: [],
  bedAvailability: 'unknown',
};

export function FacilityPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth, addFacility, updateFacility, deleteFacility } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isNewFacility = id === 'new';
  const currentFacility = isNewFacility 
    ? { ...emptyFacility, id: crypto.randomUUID() }
    : auth.facilities.find(f => f.id === id) || emptyFacility;
    
  const [facility, setFacility] = useState<Facility>(currentFacility);

  useEffect(() => {
    if (!isNewFacility && !auth.facilities.find(f => f.id === id)) {
      navigate('/dashboard');
    }
  }, [id, isNewFacility, navigate, auth.facilities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewFacility) {
      addFacility(facility);
    } else {
      updateFacility(facility);
    }
    navigate('/dashboard');
  };

  const handleDelete = async () => {
    deleteFacility(facility.id);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isNewFacility ? 'Add New Facility' : 'Edit Facility'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Facility Image URL</label>
              <input
                type="url"
                value={facility.imageUrl}
                onChange={(e) => setFacility({ ...facility, imageUrl: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Facility Name</label>
              <input
                type="text"
                value={facility.name}
                onChange={(e) => setFacility({ ...facility, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <MultiSelect
              options={facilityTypes}
              selected={facility.type}
              onChange={(selected) => setFacility({ ...facility, type: selected as FacilityType[] })}
              label="Facility Type"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={facility.location}
                onChange={(e) => setFacility({ ...facility, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={facility.phone}
                onChange={(e) => setFacility({ ...facility, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fax</label>
              <input
                type="tel"
                value={facility.fax}
                onChange={(e) => setFacility({ ...facility, fax: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Contact Person (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={facility.contact.name}
                  onChange={(e) => setFacility({
                    ...facility,
                    contact: { ...facility.contact, name: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={facility.contact.email}
                  onChange={(e) => setFacility({
                    ...facility,
                    contact: { ...facility.contact, email: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Extension</label>
                <input
                  type="text"
                  value={facility.contact.phoneExt}
                  onChange={(e) => setFacility({
                    ...facility,
                    contact: { ...facility.contact, phoneExt: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MultiSelect
              options={insurances}
              selected={facility.insurances}
              onChange={(selected) => setFacility({ ...facility, insurances: selected as Insurance[] })}
              label="Insurances Accepted"
            />

            <MultiSelect
              options={services}
              selected={facility.services}
              onChange={(selected) => setFacility({ ...facility, services: selected as Service[] })}
              label="Services Offered"
            />
          </div>

          <div className="flex justify-between pt-6">
            {!isNewFacility && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Facility
              </button>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isNewFacility ? 'Add Facility' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Facility</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this facility? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}