import crypto from 'node:crypto';
import { Request, Response } from 'express';
import { appointmentSchema } from '../schema/appointmentSchema';
import { Appointment } from '../interfaces/index';

const APPOINTMENTS_HOURLY_LIMIT = 2;
const APPOINTMENTS_DAILY_LIMIT = 20;

let appointments: Appointment[] = [];

export default class AppointmentController {

  update(request: Request, response: Response): void {
    const { id } = request.params;
    const { situation, conclusion } = request.body;

    const newAppointments = appointments.map((appointment) => {
      if (appointment.id === id) {
        return {
          ...appointment,
          situation,
          conclusion,
        };
      }

      return appointment;
    });

    appointments = newAppointments;

    response.send({ message: 'Appointment Updated' });
  }

  destroy(request: Request, response: Response): void {
    const { id } = request.params;

    appointments = appointments.filter((appointment) => appointment.id !== id);

    response.status(204).send();
  }

  getAll(request: Request, response: Response): void {
    response.send({
      page: 1,
      pageSize: 20,
      totalCount: appointments.length,
      items: appointments,
    });
  }

  store(request: Request, response: Response): void {
    const appointment = request.body;

    const { success, data, error } = appointmentSchema.safeParse({
      name: appointment.name,
      situation: appointment.situation,
      birthDate: new Date(appointment.birthDate),
      scheduledDate: new Date(appointment.scheduledDate),
    });

    if (!success) {
      response.status(400).send(error);
      return;
    }

    const [id] = crypto.randomUUID().split('-');
    data.id = id;
    data.conclusion = appointment.conclusion;

    const scheduledDate = new Date(data.scheduledDate);
    scheduledDate.setSeconds(0, 0);

    if (scheduledDate.getMinutes() !== 0) {
      response.status(400).send({ message: 'O horário do agendamento precisa ser exato (ex: 13:00, 14:00).' });
      return;
    }

    const appointmentsOnDay = appointments.filter(
      (appointment) => {
        const appointmentDate = new Date(appointment.scheduledDate);
        appointmentDate.setSeconds(0, 0);
        return appointmentDate.toDateString() === scheduledDate.toDateString();
      }
    );

    if (appointmentsOnDay.length >= APPOINTMENTS_DAILY_LIMIT) {
      response.status(400).send({ message: 'Esse dia está esgotado.' });
      return;
    }

    const appointmentsAtHour = appointments.filter(
      (appointment) => {
        const appointmentDate = new Date(appointment.scheduledDate);
        appointmentDate.setSeconds(0, 0);
        return appointmentDate.getTime() === scheduledDate.getTime();
      }
    );

    if (appointmentsAtHour.length >= APPOINTMENTS_HOURLY_LIMIT) {
      response.status(400).send({ message: 'Esse horário está esgotado.' });
      return;
    }

    appointments.push(data);

    response.send({ message: 'store', data });
  }
}