import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MultiSelect } from '../components/MultiSelect';
import { useAuth } from '../hooks/useAuth';
import { facilityTypes, insurances, services } from '../features/facilities/constants';
import type { Facility } from '../types';

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
      await addFacility(facility);
    } else {
      await updateFacility(facility);
    }
    navigate('/dashboard');
  };

  const handleDelete = async () => {
    await deleteFacility(facility.id);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isNewFacility ? 'Add New Facility' : 'Edit Facility'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rest of the form JSX remains the same */}
        </form>
      </div>
    </div>
  );
}