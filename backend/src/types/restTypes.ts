export interface DBResponse<T> {
  rows: T[];
}

export interface GenericResponse<T> {
  status: number;
  data?: T;
  message?: string;
}

export interface ResultResponse {
  status: number;
  id?: string;
  message?: string;
}
