const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Department templates — icons are Material Icons names (strings)
router.get('/templates', protect, (req, res) => {
  const templates = [
    {
      name: 'Runway & Taxiway',
      category: 'airside',
      icon: 'airline_stops',
      color: '#1E40AF',
      description: 'Runway construction, taxiways, aprons and airfield lighting',
      defaultItems: [
        { name: 'Runway Construction', unit: 'sq meter', quantity: 50000, unitCost: 150 },
        { name: 'Taxiway Construction', unit: 'sq meter', quantity: 20000, unitCost: 120 },
        { name: 'Apron Area', unit: 'sq meter', quantity: 30000, unitCost: 100 },
        { name: 'Airfield Lighting', unit: 'set', quantity: 1, unitCost: 2500000 },
        { name: 'ILS (Instrument Landing System)', unit: 'set', quantity: 2, unitCost: 1500000 },
        { name: 'Runway Markings & Signage', unit: 'lump sum', quantity: 1, unitCost: 500000 }
      ]
    },
    {
      name: 'Terminal Building',
      category: 'terminal',
      icon: 'business',
      color: '#0369A1',
      description: 'Passenger terminal building construction and fit-out',
      defaultItems: [
        { name: 'Terminal Structure (Steel/Concrete)', unit: 'sq meter', quantity: 80000, unitCost: 3500 },
        { name: 'Facade & Glazing', unit: 'sq meter', quantity: 15000, unitCost: 1200 },
        { name: 'Roofing System', unit: 'sq meter', quantity: 85000, unitCost: 800 },
        { name: 'Interior Finishes', unit: 'sq meter', quantity: 80000, unitCost: 600 },
        { name: 'Passenger Boarding Bridges', unit: 'unit', quantity: 20, unitCost: 2000000 },
        { name: 'Escalators & Elevators', unit: 'unit', quantity: 40, unitCost: 250000 }
      ]
    },
    {
      name: 'Air Traffic Control Tower',
      category: 'airside',
      icon: 'cell_tower',
      color: '#7C3AED',
      description: 'ATC tower, radar and communication systems',
      defaultItems: [
        { name: 'ATC Tower Structure', unit: 'lump sum', quantity: 1, unitCost: 15000000 },
        { name: 'Radar Systems', unit: 'set', quantity: 2, unitCost: 8000000 },
        { name: 'Communication Systems', unit: 'set', quantity: 1, unitCost: 5000000 },
        { name: 'Navigation Aids (VOR/DME)', unit: 'set', quantity: 1, unitCost: 3000000 }
      ]
    },
    {
      name: 'Baggage Handling System',
      category: 'terminal',
      icon: 'luggage',
      color: '#0F766E',
      description: 'Automated baggage handling and screening equipment',
      defaultItems: [
        { name: 'Baggage Conveyor System', unit: 'lump sum', quantity: 1, unitCost: 25000000 },
        { name: 'Security Screening Equipment', unit: 'unit', quantity: 10, unitCost: 500000 },
        { name: 'Baggage Claim Carousels', unit: 'unit', quantity: 12, unitCost: 400000 },
        { name: 'Check-in Counters', unit: 'unit', quantity: 60, unitCost: 50000 }
      ]
    },
    {
      name: 'Utilities & MEP',
      category: 'utilities',
      icon: 'electrical_services',
      color: '#B45309',
      description: 'Mechanical, Electrical, Plumbing and utility infrastructure',
      defaultItems: [
        { name: 'Electrical Distribution System', unit: 'lump sum', quantity: 1, unitCost: 20000000 },
        { name: 'Backup Power (Generators)', unit: 'MVA', quantity: 10, unitCost: 1500000 },
        { name: 'HVAC System', unit: 'lump sum', quantity: 1, unitCost: 35000000 },
        { name: 'Plumbing & Drainage', unit: 'lump sum', quantity: 1, unitCost: 12000000 },
        { name: 'Fire Protection System', unit: 'lump sum', quantity: 1, unitCost: 8000000 }
      ]
    },
    {
      name: 'Road & Ground Access',
      category: 'landside',
      icon: 'road',
      color: '#15803D',
      description: 'Access roads, parking, and ground transportation',
      defaultItems: [
        { name: 'Access Road Construction', unit: 'km', quantity: 5, unitCost: 2000000 },
        { name: 'Multi-storey Car Park', unit: 'space', quantity: 5000, unitCost: 8000 },
        { name: 'Bus Terminal/Transport Hub', unit: 'lump sum', quantity: 1, unitCost: 10000000 },
        { name: 'Road Signage & Lighting', unit: 'lump sum', quantity: 1, unitCost: 2000000 }
      ]
    },
    {
      name: 'IT & Technology Systems',
      category: 'technology',
      icon: 'devices',
      color: '#1D4ED8',
      description: 'Airport management, passenger info, and security systems',
      defaultItems: [
        { name: 'Airport Management System', unit: 'lump sum', quantity: 1, unitCost: 5000000 },
        { name: 'FIDS/BIDS Displays', unit: 'unit', quantity: 200, unitCost: 15000 },
        { name: 'CCTV & Security System', unit: 'camera', quantity: 500, unitCost: 2000 },
        { name: 'Access Control System', unit: 'door', quantity: 300, unitCost: 3000 },
        { name: 'Wi-Fi & Network Infrastructure', unit: 'lump sum', quantity: 1, unitCost: 3000000 },
        { name: 'Public Address System', unit: 'lump sum', quantity: 1, unitCost: 1500000 }
      ]
    },
    {
      name: 'Fuel Farm & Storage',
      category: 'airside',
      icon: 'local_gas_station',
      color: '#DC2626',
      description: 'Aviation fuel storage and distribution',
      defaultItems: [
        { name: 'Fuel Storage Tanks', unit: 'unit', quantity: 5, unitCost: 3000000 },
        { name: 'Fuel Distribution Pipeline', unit: 'km', quantity: 3, unitCost: 1000000 },
        { name: 'Hydrant Fueling System', unit: 'unit', quantity: 20, unitCost: 200000 },
        { name: 'Fuel Monitoring System', unit: 'lump sum', quantity: 1, unitCost: 500000 }
      ]
    },
    {
      name: 'Administration Buildings',
      category: 'administration',
      icon: 'account_balance',
      color: '#64748B',
      description: 'Administrative offices and support facilities',
      defaultItems: [
        { name: 'Admin Office Building', unit: 'sq meter', quantity: 5000, unitCost: 2500 },
        { name: 'Staff Facilities', unit: 'sq meter', quantity: 3000, unitCost: 1800 },
        { name: 'Security Operations Center', unit: 'sq meter', quantity: 1000, unitCost: 3500 }
      ]
    },
    {
      name: 'Environmental & Safety',
      category: 'safety',
      icon: 'eco',
      color: '#16A34A',
      description: 'Environmental management, fire station, and safety systems',
      defaultItems: [
        { name: 'Airport Fire Station', unit: 'lump sum', quantity: 1, unitCost: 8000000 },
        { name: 'Fire Fighting Equipment (ARFF)', unit: 'vehicle', quantity: 4, unitCost: 2000000 },
        { name: 'Sewage Treatment Plant', unit: 'lump sum', quantity: 1, unitCost: 5000000 },
        { name: 'Perimeter Fence & Security', unit: 'km', quantity: 20, unitCost: 500000 },
        { name: 'Wildlife Hazard Management', unit: 'lump sum', quantity: 1, unitCost: 1000000 }
      ]
    }
  ];
  res.json({ success: true, templates });
});

module.exports = router;
