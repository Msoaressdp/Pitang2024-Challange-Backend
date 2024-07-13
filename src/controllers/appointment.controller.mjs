import z from 'zod';

const appointmentSchema = z.object({
  name: z.string(),
  birthDate: z.date(),
  scheduledDate: z.date(),
});

let appointments = [];

export default class AppointmentController {

    destroy(request, response) {}
    getOne(request, response) {}
    index(request,response) {}
    store(request, response) {}
    update(request, response) {}
  
  }