import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { AbstractApiService } from './abstract-api-service.service';
import { DataResponse } from '../models/data-response';
import { CreateUserRequest, LoginRequest, CustomerRequest, CustomerResponse, DeviceResponse, DeviceRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService extends AbstractApiService {

  constructor(
    protected readonly http: HttpClient,
    protected readonly translateService: TranslateService,
    protected readonly toastrService: ToastrService
  ) {
    super(http, '', translateService, toastrService);
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.post<DataResponse<any>>(this.getEndpointUrl('auth/login'), loginRequest);
  }

  createUser(ceateUserRequest: CreateUserRequest): Observable<any> {
    return this.post<DataResponse<any>>(this.getEndpointUrl('users'), ceateUserRequest);
  }

  customerById(id: string): Observable<CustomerResponse> {
    return this.get<DataResponse<CustomerResponse>>(this.getEndpointUrl(`customers/${id}`)).pipe(
      map((response: HttpResponse<any>) => {
        return response.body?.data;
      })
    );
  }

  paginatedCustomers(): Observable<CustomerResponse[]> {
    return this.get<DataResponse<CustomerResponse[]>>(this.getEndpointUrl('customers')).pipe(
      map((response: HttpResponse<any>) => {
        return response.body?.data || [];
      })
    );
  }

  createCustomer(customerRequest: CustomerRequest): Observable<CustomerResponse> {
    return this.post<DataResponse<CustomerResponse>>(
      this.getEndpointUrl('customers'), customerRequest
    ).pipe(map((response: HttpResponse<any>) => {
      return response.body?.data;
    }));
  }

  updateCustomer(customerRequest: CustomerRequest): Observable<CustomerResponse> {
    return this.put<DataResponse<CustomerResponse>>(
      this.getEndpointUrl(`customers/${customerRequest.id}`), customerRequest
    ).pipe(map((response: HttpResponse<any>) => {
      return response.body?.data;
    }));
  }

  deleteCustomer(id: string): Observable<boolean> {
    return this.delete<DataResponse<boolean>>(this.getEndpointUrl(`customers/${id}`)).pipe(
      map((response: HttpResponse<any>) => {
        return response.body?.data;
      })
    );
  }

  deviceById(id: string): Observable<DeviceResponse> {
    return this.get<DataResponse<DeviceResponse>>(this.getEndpointUrl(`devices/${id}`)).pipe(
      map((response: HttpResponse<any>) => {
        return response.body?.data;
      })
    );
  }

  paginatedDevices(): Observable<DeviceResponse[]> {
    return this.get<DataResponse<DeviceResponse[]>>(this.getEndpointUrl('devices')).pipe(
      map((response: HttpResponse<any>) => {
        return response.body?.data || [];
      })
    );
  }

  createDevice(deviceRequest: DeviceRequest): Observable<DeviceResponse> {
    return this.post<DataResponse<DeviceResponse>>(
      this.getEndpointUrl('devices'), deviceRequest
    ).pipe(map((response: HttpResponse<any>) => {
      return response.body?.data;
    }));
  }

  updateDevice(deviceRequest: DeviceRequest): Observable<DeviceResponse> {
    return this.put<DataResponse<DeviceResponse>>(
      this.getEndpointUrl(`devices/${deviceRequest.id}`), deviceRequest
    ).pipe(map((response: HttpResponse<any>) => {
      return response.body?.data;
    }));
  }

  deleteDevice(id: string): Observable<boolean> {
    return this.delete<DataResponse<boolean>>(this.getEndpointUrl(`devices/${id}`)).pipe(
      map((response: HttpResponse<any>) => {
        return response.body?.data;
      })
    );
  }

  private getEndpointUrl(endpoint: string): string {
    return new URL(`/service/api/v1/${endpoint}`, window.location.origin).href;
  }

}
