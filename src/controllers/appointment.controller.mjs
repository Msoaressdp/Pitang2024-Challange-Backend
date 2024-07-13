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
    store(request, response) {
      const appointment = request.body;
  
      const { sucess, data, error } = appointmentSchema.safeParse({
  
        name: appointment.name,
        birthDate: appointment.birthDate,
        scheduledDate: appointment.scheduledDate,
  
      });
  
      if (!sucess){
        return response.status(400).send(error);
      }
  
      appointments.push(data);
  
      response.send({ message: 'store', data });
  
  
    }
    
    update(request, response) {}
  
  }