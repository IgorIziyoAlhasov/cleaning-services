'use client';
import { useEffect, useState } from 'react';
import ClientForm from '../components/ClientForm';
import { createClient } from '../services/clientService';
import ApplicationNav from '../components/ApplicationNav';

export default function RegisterClient() {
  const [client, setClient] = useState({
    company_name: '',
    email: '',
    street_address: '',
    floor: '',
    business_center_id: '',
    contact_person: '',
    phone_number: '',
    days_of_service: [],
    hours_per_day: '',
    cleaning_supplies: false,
    after_hours_cleaning: false,
    comments: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, field, isCheckbox = false) => {
    const newValue = isCheckbox ? e.target.checked : e.target.value;


    setClient({
      ...client,
      [field]: newValue,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newClient = await createClient(client);
      console.log('Client created successfully:', newClient);
      setClient({
        company_name: '',
        email: '',
        street_address: '',
        floor: '',
        business_center_id: '',
        contact_person: '',
        phone_number: '',
        days_of_service: [],
        hours_per_day: '',
        cleaning_supplies: false,
        after_hours_cleaning: false,
        comments: ''
      });
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ApplicationNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Register Client</h1>
        <ClientForm
          client={client}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
          isEditing={false}
          isModal={false}
          handleClose={() => console.log('Close form')}
        />
        {loading && <p>Loading...</p>}
      </div>
    </>
  );
}