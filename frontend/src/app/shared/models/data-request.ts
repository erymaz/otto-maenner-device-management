export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface CustomerRequest {
  id?: string;
  name: string;
}

export interface DeviceRequest {
  id?: string;
  customerId?: string;
  name: string;
  device: string
}
