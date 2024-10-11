'use client';
import { useState, useEffect } from 'react';
import { fetchClients, fetchDaysOfWeek, updateClient } from '../services/clientService';
import ApplicationNav from '../components/ApplicationNav';
import ClientForm from '../components/ClientForm';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, TextField } from '@mui/material';
import Notification from '../components/Notification';

export default function ViewClients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // For Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // For Search and Filtering
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadClientsAndDays = async () => {
      const fetchedClients = await fetchClients();
      setClients(fetchedClients);
      setFilteredClients(fetchedClients); // Initialize with all clients

      const fetchedDaysOfWeek = await fetchDaysOfWeek();
      setDaysOfWeek(fetchedDaysOfWeek);
    };

    loadClientsAndDays();
  }, []);

  // Pagination Handler
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search Handler
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = clients.filter(client =>
      client.company_name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.contact_person.toLowerCase().includes(query)
    );

    setFilteredClients(filtered);
  };

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
      setFilteredClients(updatedClients); // Update filtered clients as well
      setOpen(false);
      setNotification({ open: true, message: 'Client updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating client:', error);
      setNotification({ open: true, message: 'Failed to update client.', severity: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Function to map day IDs to names
  const mapDayIdsToNames = (dayIds) => {
    if (!Array.isArray(dayIds)) {
      try {
        dayIds = JSON.parse(dayIds);
      } catch (e) {
        return [];
      }
    }

    return dayIds
      .map((dayId) => {
        const day = daysOfWeek.find((d) => d.id === dayId);
        return day ? day.day_name : null;
      })
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ApplicationNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Registered Clients</h1>

        {/* Search Input */}
        <TextField
          label="Search Clients"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4"
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-bold">Company Name</TableCell>
                <TableCell className="font-bold">Email</TableCell>
                <TableCell className="font-bold">Address</TableCell>
                <TableCell className="font-bold">Floor</TableCell>
                <TableCell className="font-bold">Business Center</TableCell>
                <TableCell className="font-bold">Contact Person</TableCell>
                <TableCell className="font-bold">Phone Number</TableCell>
                <TableCell className="font-bold">Days of Service</TableCell>
                <TableCell className="font-bold">Hours per Day</TableCell>
                <TableCell className="font-bold">Cleaning Supplies</TableCell>
                <TableCell className="font-bold">After Hours Cleaning</TableCell>
                <TableCell className="font-bold">Comments</TableCell>
                <TableCell className="font-bold">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.company_name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.street_address}</TableCell>
                    <TableCell>{client.floor}</TableCell>
                    <TableCell>{client.business_center_id}</TableCell>
                    <TableCell>{client.contact_person}</TableCell>
                    <TableCell>{client.phone_number}</TableCell>
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

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredClients.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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

        {/* Notification Component */}
        <Notification
          message={notification.message}
          severity={notification.severity}
          open={notification.open}
          isModal={true}
          onClose={handleCloseNotification}
        />
      </main>
    </div>
  );
}
