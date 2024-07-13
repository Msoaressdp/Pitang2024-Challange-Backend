import express from 'express';
import cors from 'cors'
import appointmentRoutes from './routes/appointment.router.mjs';

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors()); 
server.use(express.json());
server.use(appointmentRoutes);

server.listen(PORT, () => {
  console.log(`Running at localhost${PORT}`);
});