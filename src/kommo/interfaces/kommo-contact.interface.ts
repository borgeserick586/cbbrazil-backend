export interface KommoContactPayload {
  name: string;
  first_name: string;
  last_name: string;
  custom_fields_values: Array<{
    field_id: number;
    values: Array<{
      value: string;
      enum_code?: string;
    }>;
  }>;
}

export interface KommoContactResponse {
  _embedded?: {
    contacts?: Array<{
      id: number;
      name: string;
    }>;
  };
}
