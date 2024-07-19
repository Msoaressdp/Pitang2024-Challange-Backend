import { Request, Response } from 'express';
import AppointmentController from '../controllers/appointment.controller';
import { mockAppointments } from './mockAppointments';

describe('AppointmentController: getAll method', () => {
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