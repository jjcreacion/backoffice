export interface ContactDetail {
  pkContact: number;
  entry: number;
  isCommercial: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  person: {
    pkPerson: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    dateOfBirth: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    emails: {
      pkEmail: number;
      email: string;
      isPrimary: number;
      status: number;
      createdAt: string;
      updatedAt: string;
    }[];
    phones: {
      pkPhone: number;
      phone: string;
      isPrimary: number;
      status: number;
      createdAt: string;
      updatedAt: string;
    }[];
    addresses: {
      pkAddress: number;
      address: string;
      isPrimary: number;
      status: number;
      createdAt: string;
      updatedAt: string;
    }[];
    notes: {
      pkNote: number;
      note: string;
      isPriority: number;
      createdAt: string;
      updatedAt: string;
      contact: {
        pkContact: number;
      };
      user: {
        pkUser: number;
        username: string;
        email: string;
        person: {
          pkPerson: number;
          firstName: string;
          middleName: string | null;
          lastName: string;
        };
      };
    }[];
  };
}