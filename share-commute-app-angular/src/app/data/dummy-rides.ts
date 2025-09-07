import { Rides } from '../interfaces/add-ride';

export const DUMMY_RIDES: Rides[] = [
  {
    employeeId: 'E001',
    vehicleType: 'Car',
    vehicleNo: 'KA01AB1234',
    vacantSeats: 3,
    time: new Date(new Date().setHours(10, 0, 0)), // 10:00 AM today
    pickupPoint: 'Office A',
    destination: 'Office B',
  },
  {
    employeeId: 'E002',
    vehicleType: 'Bike',
    vehicleNo: 'KA02XY5678',
    vacantSeats: 1,
    time: new Date(new Date().setHours(14, 30, 0)), // 2:30 PM today
    pickupPoint: 'Office C',
    destination: 'Office D',
  },
  {
    employeeId: 'E003',
    vehicleType: 'Car',
    vehicleNo: 'KA03CD7890',
    vacantSeats: 2,
    time: new Date(new Date().setHours(16, 0, 0)), // 4:00 PM today
    pickupPoint: 'Office E',
    destination: 'Office F',
  },
];
