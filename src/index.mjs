import express from 'express';
import appointmentRoutes from './routes/appointment.router.mjs';

const PORT = process.env.PORT || 5000;

const server = express();

server.use(express.json());
server.use(appointmentRoutes);

server.listen(PORT, () => {
  console.log(`Running at localhost${PORT}`);
});