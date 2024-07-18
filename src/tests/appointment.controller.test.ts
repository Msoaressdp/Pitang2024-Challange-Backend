import { Request, Response } from 'express';
import AppointmentController from '../controllers/appointment.controller';
import { mockAppointments } from './mockAppointments';
import { Appointment } from '../interfaces/index';

describe('AppointmentController', () => {
  let appointmentController: AppointmentController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    appointmentController = new AppointmentController();

    mockRequest = {
      params: { id: '1' },
      body: { situation: 'completed', conclusion: 'done' },
    } as Partial<Request>;

    mockResponse = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    (appointmentController as any).appointments = [...mockAppointments];
  });

  it('should update the appointment with the given id', () => {
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
    appointmentController.update(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Appointment Updated' });

    const nonUpdatedAppointment = (appointmentController as any).appointments.find((appointment: Appointment) => appointment.id === '3');
    expect(nonUpdatedAppointment).toBeUndefined();

    const updatedAppointment = (appointmentController as any).appointments.find((appointment: Appointment) => appointment.id === '1');
    expect(updatedAppointment).toEqual({
      id: '1',
      name: 'Matheus Soares da Silva Dantas Pereira',
      situation: 'pending',
      birthDate: new Date('1990-01-01'),
      scheduledDate: new Date('2024-07-21T13:00:00Z'),
      conclusion: '',
    });
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
    expect(existingAppointment).toEqual({
      id: '1',
      name: 'Matheus Soares da Silva Dantas Pereira',
      situation: 'pending',
      birthDate: new Date('1990-01-01'),
      scheduledDate: new Date('2024-07-21T13:00:00Z'),
      conclusion: '',
    });
  });

  it('should return all appointments', () => {
    appointmentController.getAll(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.send).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      totalCount: mockAppointments.length,
      items: mockAppointments,
    });
  });

  it('should return an empty list if there are no appointments', () => {
    (appointmentController as any).appointments = [];
    appointmentController.getAll(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.send).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      totalCount: 0,
      items: [],
    });
  });
});