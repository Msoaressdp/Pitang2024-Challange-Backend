import z from 'zod';

const appointmentSchema = z.object({
  name: z.string(),
  birthDate: z.date(),
  scheduledDate: z.date(),
});

const APPOINTMENTS_HOURLY_LIMIT = 2;
const APPOINTMENTS_DAILY_LIMIT = 20;

let appointments = [];

export default class AppointmentController {

    destroy(request, response) {}
    getOne(request, response) {}
    index(request,response) {}
    store(request, response) {
      const appointment = request.body;
  
      const { success, data, error } = appointmentSchema.safeParse({
  
        name: appointment.name,
        birthDate: new Date(appointment.birthDate),
        scheduledDate: new Date(appointment.scheduledDate),
  
      });
  
      if (!success){
        return response.status(400).send(error);
      }
      
      const scheduledDate = data.scheduledDate;

      const appointmentsOnDay = appointments.filter(
        (appointment) => appointment.scheduledDate.toDateString() === scheduledDate.toDateString()
      );

      if (appointmentsOnDay.length >= APPOINTMENTS_DAILY_LIMIT) {
        return response.status(400).send({ message: 'No available slots on this day.' });
      }

      const appointmentsAtHour = appointments.filter(
        (appointment) => appointment.scheduledDate.getTime() === scheduledDate.getTime()
      );

      if (appointmentsAtHour.length >= APPOINTMENTS_HOURLY_LIMIT) {
        return response.status(400).send({ message: 'No available slots at this hour.' });
      }

      appointments.push(data);
  
      response.send({ message: 'store', data });
  
  
    }

    update(request, response) {}
  
  }