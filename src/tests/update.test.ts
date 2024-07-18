import { Request, Response } from 'express';
import AppointmentController from '../controllers/appointment.controller';
import { mockAppointments } from './mockAppointments';
import { Appointment } from '../interfaces/index';

describe('AppointmentController: update method', () => {
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

  it('should update the appointment with the given id', () => {
    mockRequest.params = { id: '1' };
    mockRequest.body = { situation: 'completed', conclusion: 'done' };

    appointmentController.update(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Appointment Updated' });

    const updatedAppointment = (appointmentController as any).appointments.find((appointment: Appointment) => appointment.id === '1');
    expect(updatedAppointment).toEqual({
      id: '1',
      name: 'Matheus Soares da Silva Dantas Pereira',
      situation: 'completed',
      birthDate: new Date('1990-01-01'),
      scheduledDate: new Date('2024-07-21T13:00:00Z'),
      conclusion: 'done',
    });
  });

  it('should not update any appointment if id does not match', () => {
    mockRequest.params = { id: '3' };
    mockRequest.body = { situation: 'completed', conclusion: 'done' };

    appointmentController.update(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Appointment Updated' });

    const nonUpdatedAppointment = (appointmentController as any).appointments.find((appointment: Appointment) => appointment.id === '3');
    expect(nonUpdatedAppointment).toBeUndefined();

    const updatedAppointment = (appointmentController as any).appointments.find((appointment: Appointment) => appointment.id === '1');
    expect(updatedAppointment).toEqual(mockAppointments[0]);
  });
});