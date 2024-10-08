'use client';
import { useState, useEffect } from 'react';
import { fetchClients, updateClient } from '../services/clientService'; 
import ApplicationNav from '../components/ApplicationNav';
import ClientForm from '../components/ClientForm';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export default function ViewClients() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null); // To store the client for editing
  const [open, setOpen] = useState(false); // Modal state

  useEffect(() => {
    const loadClients = async () => {
      try {
        const fetchedClients = await fetchClients();
        setClients(fetchedClients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    loadClients();
  }, []);

  // Open the modal with the selected client
  const handleEditClick = (client) => {
    setSelectedClient(client);
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
  };

  // Handle client update submission
  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      const updatedClient = await updateClient(selectedClient.id, selectedClient);
      console.log('Client updated:', updatedClient);
      // Refresh the clients list or update the client in place
      const updatedClients = clients.map((client) =>
        client.id === selectedClient.id ? updatedClient[0] : client
      );
      setClients(updatedClients);
      setOpen(false);
    } catch (error) {
      console.error('Error updating client:', error);
    }
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
                  <TableCell>{client.days_of_service}</TableCell>
                  <TableCell>{client.hours_per_day}</TableCell>
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
            client={selectedClient}
            handleSubmit={handleUpdateClient}
            handleInputChange={(e, field, isCheckbox = false) =>
              setSelectedClient({
                ...selectedClient,
                [field]: isCheckbox ? e.target.checked : e.target.value,
              })
            }
            isEditing={true}
            isModal={true}
            handleClose={handleClose}
          />
        )}
      </main>
    </div>
  );
}