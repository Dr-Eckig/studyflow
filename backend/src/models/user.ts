export interface User {
  id?: string;
  email: string;
  darkMode?: boolean;
  language?: string;
}

export interface Login {
  email: string;
  password: string;
}
