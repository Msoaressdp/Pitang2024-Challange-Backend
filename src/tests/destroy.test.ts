import { Request, Response } from 'express';
import AppointmentController from '../controllers/appointment.controller';
import { mockAppointments } from './mockAppointments';
import { Appointment } from '../interfaces/index';

describe('AppointmentController: destroy method', () => {
  let appointmentController: AppointmentController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    appointmentController = new AppointmentController();

    mockRequest = {} as Partial<Request>;
    mockResponse = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    (appointmentController as any).appointments = [...mockAppointments];
  });

  it('should destroy the appointment with the given id', () => {
    mockRequest.params = { id: '1' };

    appointmentController.destroy(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();

    const deletedAppointment = (appointmentController as any).appointments.find((appointment: Appointment) => appointment.id === '1');
    expect(deletedAppointment).toBeUndefined();
  });

  it('should not destroy any appointment if id does not match', () => {
    mockRequest.params = { id: '3' };

    appointmentController.destroy(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();

    const existingAppointment = (appointmentController as any).appointments.find((appointment: Appointment) => appointment.id === '1');
    expect(existingAppointment).toEqual(mockAppointments[0]);
  });
});