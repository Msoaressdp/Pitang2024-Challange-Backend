import express from 'express';
import cors from 'cors'
import helmet from 'helmet'
import appointmentRoutes from './routes/appointment.router';

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors()); 
server.use(express.json());
server.use(helmet());
server.use(appointmentRoutes);

server.listen(PORT, () => {
  console.log(`Running at localhost${PORT}`);
});