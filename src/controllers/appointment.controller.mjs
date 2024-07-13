import z from 'zod';
import crypto from 'node:crypto';

const appointmentSchema = z.object({
  name: z.string(),
  birthDate: z.date(),
  scheduledDate: z.date(),
  id: z.string().optional(),
  situation: z.string().default("Undone"),
  conclusion: z.string().optional(),
});

const APPOINTMENTS_HOURLY_LIMIT = 2;
const APPOINTMENTS_DAILY_LIMIT = 20;

let appointments = [];

export default class AppointmentController {

  update(request, response) {
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

    destroy(request, response) {
      const { id } = request.params;
  
      appointments =  appointments.filter((appointment) =>  appointment.id !== id);
  
      response.status(204).send();
    }

    getAll(request,response) {
      response.send({
        page: 1, 
        pageSize: 20 ,
        totalCount: appointments.length, 
        items: appointments,
      });
    }

    store(request, response) {
      const appointment = request.body;
  
      const { success, data, error } = appointmentSchema.safeParse({
  
        name: appointment.name,
        situation: appointment.situation,
        birthDate: new Date(appointment.birthDate),
        scheduledDate: new Date(appointment.scheduledDate),
  
      });
  
      if (!success){
        return response.status(400).send(error);
      }

      const [id] = crypto.randomUUID().split('-');

      data.id = id;
      data.conclusion = appointment.conclusion;
      
      const scheduledDate = new Date(data.scheduledDate.toISOString());
      if (scheduledDate.getMinutes() !== 0 || scheduledDate.getSeconds() !== 0) {
        return response.status(400).send({ message: 'O horário do agendamento precisa ser exato (ex: 13:00, 14:00).' });
      }

      const appointmentsOnDay = appointments.filter(
        (appointment) => appointment.scheduledDate.toDateString() === scheduledDate.toDateString()
      );

      if (appointmentsOnDay.length >= APPOINTMENTS_DAILY_LIMIT) {
        return response.status(400).send({ message: 'Esse dia está esgotado.' });
      }

      const appointmentsAtHour = appointments.filter(
        (appointment) => appointment.scheduledDate.getTime() === scheduledDate.getTime()
      );

      if (appointmentsAtHour.length >= APPOINTMENTS_HOURLY_LIMIT) {
        return response.status(400).send({ message: 'Esse horário está esgotado.' });
      }

      appointments.push(data);
  
      response.send({ message: 'store', data });
  
  
    }

}