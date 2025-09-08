export interface Rides {
  employeeId: string;
  vehicleType: 'Bike' | 'Car';
  vehicleNo: string;
  vacantSeats: number;
  time: string;
  pickupPoint: string;
  destination: string;
}
