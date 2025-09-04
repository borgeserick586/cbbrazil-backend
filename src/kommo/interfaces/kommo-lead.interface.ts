export interface KommoLeadPayload {
  name: string;
  price: number;
  contacts_id: number[];
  custom_fields_values: Array<{
    field_id: number;
    values: Array<{
      value?: string;
      enum_id?: number;
    }>;
  }>;
  tags: Array<{
    name: string;
  }>;
}

export interface KommoLeadResponse {
  _embedded?: {
    leads?: Array<{
      id: number;
      name: string;
    }>;
  };
}
