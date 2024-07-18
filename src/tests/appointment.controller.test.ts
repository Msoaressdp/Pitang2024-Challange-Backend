import { Request, Response } from 'express';
import AppointmentController from '../controllers/appointment.controller';
import { mockAppointments } from './mockAppointments';
import { Appointment } from '../interfaces/index';
import crypto from 'node:crypto';

describe('AppointmentController', () => {
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

  it('should store a new appointment successfully', () => {
    const newAppointment = {
      name: 'Carlos Augusto',
      situation: 'pending',
      birthDate: '2000-01-01',
      scheduledDate: '2024-07-21T14:00:00Z',
      conclusion: '',
    };

    mockRequest.body = newAppointment;

    appointmentController.store(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.send).toHaveBeenCalledWith(expect.objectContaining({
      message: 'store',
      data: expect.objectContaining({
        name: 'Carlos Augusto',
        situation: 'pending',
        birthDate: new Date('2000-01-01'),
        scheduledDate: new Date('2024-07-21T14:00:00Z'),
        conclusion: '',
      }),
    }));

    const storedAppointment = (appointmentController as any).appointments.find((appointment: Appointment) => appointment.name === 'Carlos Augusto');
    expect(storedAppointment).toBeTruthy();
  });

  it('should not store an appointment with invalid data', () => {
    const invalidAppointment = {
      name: 'Tobias Junho',
      situation: 'pending',
      birthDate: 'invalid-date',
      scheduledDate: 'invalid-date',
      conclusion: '',
    };

    mockRequest.body = invalidAppointment;

    appointmentController.store(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalled();
  });

  it('should not store an appointment if the hourly limit is reached', () => {
    const newAppointment1 = {
      id: crypto.randomUUID().split('-')[0],
      name: 'Tobias Agosto',
      situation: 'pending',
      birthDate: new Date('2000-01-01'),
      scheduledDate: new Date('2024-07-21T13:00:00Z'),
      conclusion: '',
    };

    const newAppointment2 = {
      id: crypto.randomUUID().split('-')[0],
      name: 'José Aguiar',
      situation: 'pending',
      birthDate: new Date('2000-01-01'),
      scheduledDate: new Date('2024-07-21T13:00:00Z'),
      conclusion: '',
    };

    (appointmentController as any).appointments.push(newAppointment1, newAppointment2);

    const newAppointment = {
      name: 'Carlos Augusto',
      situation: 'pending',
      birthDate: '2000-01-01',
      scheduledDate: '2024-07-21T13:00:00Z',
      conclusion: '',
    };

    mockRequest.body = newAppointment;

    appointmentController.store(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Esse horário está esgotado.' });
  });

  it('should not store an appointment if the daily limit is reached', () => {
    const newAppointment = {
      name: 'Carlos Augusto',
      situation: 'pending',
      birthDate: '2000-01-01',
      scheduledDate: '2024-07-22T13:00:00Z',
      conclusion: '',
    };

    for (let i = 0; i < 20; i++) {
      (appointmentController as any).appointments.push({
        id: crypto.randomUUID().split('-')[0],
        name: `Mock ${i}`,
        situation: 'pending',
        birthDate: new Date('2000-01-01'),
        scheduledDate: new Date('2024-07-22T13:00:00Z'),
        conclusion: '',
      });
    }

    mockRequest.body = newAppointment;

    appointmentController.store(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Esse dia está esgotado.' });
  });

  it('should not store an appointment with broken minutes', () => {
    const newAppointment = {
      name: 'Carlos Augusto',
      situation: 'pending',
      birthDate: '2000-01-01',
      scheduledDate: '2024-07-21T13:30:00Z',
      conclusion: '',
    };

    mockRequest.body = newAppointment

    appointmentController.store(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({ message: 'O horário do agendamento precisa ser exato (ex: 13:00, 14:00).' });
  });
});