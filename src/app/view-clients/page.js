'use client';
import { useState, useEffect } from 'react';
import { fetchClients, fetchDaysOfWeek, updateClient } from '../services/clientService'; // Assuming we have a fetchDaysOfWeek service
import ApplicationNav from '../components/ApplicationNav';
import ClientForm from '../components/ClientForm';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Notification from '../components/Notification';

export default function ViewClients() {
  const [clients, setClients] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const loadClientsAndDays = async () => {
      const fetchedClients = await fetchClients();
      setClients(fetchedClients);

      const fetchedDaysOfWeek = await fetchDaysOfWeek(); // Fetch the day names from the server
      setDaysOfWeek(fetchedDaysOfWeek);
    };

    loadClientsAndDays();
  }, []);

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setOpen(true);
  };

  const handleUpdateClient = async (updatedClient) => {
    try {
      await updateClient(updatedClient.id, updatedClient);
      const updatedClients = clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      );
      setClients(updatedClients);
      setOpen(false);
      setNotification({ open: true, message: 'Client updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating client:', error);
      setNotification({ open: true, message: 'Failed to update client.', severity: 'error' });
    }
  };

  // Function to map the day IDs to their actual names
  const mapDayIdsToNames = (dayIds) => {
    if (!Array.isArray(dayIds)) {
      try {
        dayIds = JSON.parse(dayIds); // If dayIds are stored as a string, parse them
      } catch (e) {
        return []; // Return an empty array if parsing fails
      }
    }

    return dayIds
      .map((dayId) => {
        const day = daysOfWeek.find((d) => d.id === dayId);
        return day ? day.day_name : null; // Return the name of the day
      })
      .filter(Boolean) // Filter out null values
      .join(', ');
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ApplicationNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Registered Clients</h1>

        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Floor</TableCell>
                <TableCell>Business Center</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Days of Service</TableCell>
                <TableCell>Hours per Day</TableCell>
                <TableCell>Cleaning Supplies</TableCell>
                <TableCell>After Hours Cleaning</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.company_name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.street_address}</TableCell>
                  <TableCell>{client.floor}</TableCell>
                  <TableCell>{client.business_center_id}</TableCell>
                  <TableCell>{client.contact_person}</TableCell>
                  <TableCell>{client.phone_number}</TableCell>

                  {/* Use the mapDayIdsToNames function to display the actual day names */}
                  <TableCell>{mapDayIdsToNames(client.days_of_service)}</TableCell>

                  <TableCell>{client.hours_per_day}</TableCell>
                  <TableCell>{client.cleaning_supplies ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{client.after_hours_cleaning ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{client.comments}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEditClick(client)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {open && (
          <ClientForm
            initialClient={selectedClient}
            handleSubmit={handleUpdateClient}
            isEditing={true}
            isModal={true}
            handleClose={() => setOpen(false)}
          />
        )}

        <Notification
          message={notification.message}
          severity={notification.severity}
          open={notification.open}
          onClose={handleCloseNotification}
        />
      </main>
    </div>
  );
}