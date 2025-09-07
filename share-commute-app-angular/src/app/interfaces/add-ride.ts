export interface Rides {
  employeeId: string;
  vehicleType: 'Bike' | 'Car';
  vehicleNo: string;
  vacantSeats: number;
  time: Date;
  pickupPoint: string;
  destination: string;
}
