import { Appointment } from '../interfaces/index';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    name: 'Matheus Soares da Silva Dantas Pereira',
    situation: 'pending',
    birthDate: new Date('1990-01-01'),
    scheduledDate: new Date('2024-07-21T13:00:00Z'),
    conclusion: '',
  },
  {
    id: '2',
    name: 'Daniela Soares',
    situation: 'pending',
    birthDate: new Date('1991-01-01'),
    scheduledDate: new Date('2024-07-21T14:00:00Z'),
    conclusion: '',
  },
];