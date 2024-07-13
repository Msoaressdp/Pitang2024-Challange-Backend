import { Router } from 'express';
import AppointmentController from '../controllers/appointment.controller.mjs';

const routes = Router();

const appointmentController = new AppointmentController();

routes.get('/api/appointment', (request, response) =>
  appointmentController.getAll(request, response)
);

routes.post('/api/appointment', (request, response) =>
  appointmentController.store(request, response)
);

routes.put('/api/appointment/:id', (request, response) =>
  appointmentController.update(request, response)
);

routes.delete('/api/appointment/:id', (request, response) =>
  appointmentController.destroy(request, response)
);

export default routes;