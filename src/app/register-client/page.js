'use client';
import ClientForm from '../components/ClientForm';
import { createClient } from '../services/clientService';
import ApplicationNav from '../components/ApplicationNav';
import Notification from '../components/Notification';
import { useState } from 'react';

export default function RegisterClient() {
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (clientData) => {
    try {
      const newClient = await createClient(clientData);
      setNotification({ open: true, message: 'Client created successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error creating client:', error);
      setNotification({ open: true, message: 'Failed to create client.', severity: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <ApplicationNav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Register Client</h1>
        <ClientForm handleSubmit={handleSubmit} isEditing={false} isModal={false} />

        <Notification
          message={notification.message}
          severity={notification.severity}
          open={notification.open}
          onClose={handleCloseNotification}
        />
      </div>
    </>
  );
}
