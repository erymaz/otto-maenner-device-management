export type DataResponseMeta = Record<string, unknown>;

export interface DataResponse<T, U extends DataResponseMeta = DataResponseMeta> {
  data: T;
  meta: U;
}

export interface DeviceResponse {
  id: string
  name: string;
  device: string;
  firmwareVersion: string;
  customer: CustomerResponse;
  online: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  id: string
  name: string;
  devices: DeviceResponse[];
  createdAt: string;
  updatedAt: string;
}
