'use client';
import { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, OutlinedInput, Chip } from '@mui/material';
import { fetchDaysOfWeek, fetchBusinessCenters } from '../services/clientService'; // Assuming these functions fetch the data

export default function ClientForm({
  initialClient = {}, // For editing, we pass an initial client; for creating, we start with empty data
  handleSubmit,
  isEditing = false,
  handleClose,
  isModal = false,
}) {
  // State management for the client
  const [client, setClient] = useState({
    company_name: initialClient.company_name || '',
    email: initialClient.email || '',
    street_address: initialClient.street_address || '',
    floor: initialClient.floor || '',
    business_center_id: initialClient.business_center_id || '',
    contact_person: initialClient.contact_person || '',
    phone_number: initialClient.phone_number || '',
    days_of_service: initialClient.days_of_service || [],
    hours_per_day: initialClient.hours_per_day || '',
    cleaning_supplies: initialClient.cleaning_supplies || false,
    after_hours_cleaning: initialClient.after_hours_cleaning || false,
    comments: initialClient.comments || ''
  });

  // State management for dropdown options
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [businessCenters, setBusinessCenters] = useState([]);

  // Fetch days of the week and business centers when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const days = await fetchDaysOfWeek();
        setDaysOfWeek(days);

        const centers = await fetchBusinessCenters();
        setBusinessCenters(centers);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Handle input changes
  const handleInputChange = (e, field, isCheckbox = false) => {
    const newValue = isCheckbox ? e.target.checked : e.target.value;
    setClient({
      ...client,
      [field]: newValue,
    });
  };

  // Handle the business center selection and autofill address and floor
  const handleBusinessCenterChange = (event) => {
    const selectedCenterId = event.target.value;
    const selectedCenter = businessCenters.find(center => center.id === selectedCenterId);

    if (selectedCenter) {
      setClient({
        ...client,
        business_center_id: selectedCenterId,
        street_address: selectedCenter.address,
        floor: selectedCenter.floor_count || '',
      });
    }
  };

  const handleDaysOfServiceChange = (event) => {
    const { target: { value } } = event;
    setClient({
      ...client,
      days_of_service: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleRemoveDay = (dayToRemove) => {
    const updatedDays = client.days_of_service.filter((dayId) => dayId !== dayToRemove);
    setClient({
      ...client,
      days_of_service: updatedDays,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(client);
  };

  return (
    <div className={isModal ? "bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative" : "bg-white w-full p-6 rounded-lg shadow"}>
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Client' : 'Register Client'}</h2>
      <form onSubmit={onSubmit}>
        <TextField
          label="Company Name"
          fullWidth
          value={client.company_name}
          onChange={(e) => handleInputChange(e, 'company_name')}
          className="mb-4"
        />
        <TextField
          label="Email"
          fullWidth
          value={client.email}
          onChange={(e) => handleInputChange(e, 'email')}
          className="mb-4"
        />
        <TextField
          label="Street Address"
          fullWidth
          value={client.street_address}
          onChange={(e) => handleInputChange(e, 'street_address')}
          className="mb-4"
        />
        <TextField
          label="Floor"
          fullWidth
          value={client.floor}
          onChange={(e) => handleInputChange(e, 'floor')}
          className="mb-4"
        />

        {/* Business Center Dropdown */}
        <InputLabel id="business-center-label">Business Center</InputLabel>
        <Select
          labelId="business-center-label"
          value={client.business_center_id}
          onChange={handleBusinessCenterChange}
          fullWidth
          className="mb-4"
        >
          {businessCenters.map((center) => (
            <MenuItem key={center.id} value={center.id}>
              {center.name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Contact Person"
          fullWidth
          value={client.contact_person}
          onChange={(e) => handleInputChange(e, 'contact_person')}
          className="mb-4"
        />
        <TextField
          label="Phone Number"
          fullWidth
          value={client.phone_number}
          onChange={(e) => handleInputChange(e, 'phone_number')}
          className="mb-4"
        />

        {/* Days of Service Multiselect */}
        <InputLabel id="days-of-service-label">Days of Service</InputLabel>
        <Select
          labelId="days-of-service-label"
          multiple
          value={client.days_of_service}
          onChange={handleDaysOfServiceChange}
          input={<OutlinedInput id="select-multiple-chip" label="Days of Service" />}
          renderValue={(selected) => (
            <div className="flex flex-wrap gap-1">
              {selected.map((dayId) => {
                const day = daysOfWeek.find((d) => d.id === dayId);
                return day ? (
                  <Chip
                    key={day.id}
                    label={day.day_name}
                    onDelete={() => handleRemoveDay(day.id)}
                  />
                ) : null;
              })}
            </div>
          )}
          fullWidth
          className="mb-4"
        >
          {daysOfWeek.map((day) => (
            <MenuItem key={day.id} value={day.id}>
              {day.day_name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Hours per Day"
          fullWidth
          value={client.hours_per_day}
          onChange={(e) => handleInputChange(e, 'hours_per_day')}
          className="mb-4"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={client.cleaning_supplies}
              onChange={(e) => handleInputChange(e, 'cleaning_supplies', true)}
            />
          }
          label="Cleaning Supplies"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={client.after_hours_cleaning}
              onChange={(e) => handleInputChange(e, 'after_hours_cleaning', true)}
            />
          }
          label="After Hours Cleaning"
        />

        <TextField
          label="Comments"
          fullWidth
          value={client.comments}
          onChange={(e) => handleInputChange(e, 'comments')}
          className="mb-4"
        />

        <div className="flex justify-between">
          <Button variant="contained" color="primary" type="submit">
            {isEditing ? 'Save Changes' : 'Create Client'}
          </Button>
          {isModal && (
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}