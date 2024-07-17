export interface Appointment {
    name: string;
    birthDate: Date;
    scheduledDate: Date;
    id?: string;
    situation?: string;
    conclusion?: string;
  }