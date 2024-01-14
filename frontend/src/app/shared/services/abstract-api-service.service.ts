import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import httpErrors from 'http-errors';
import urlJoin from 'url-join';

export class AbstractApiService {

  constructor(
    protected readonly http: HttpClient,
    protected readonly serviceBaseUrl: string,
    protected readonly translateService: TranslateService,
    protected readonly toastrService: ToastrService
  ) { }

  get<T = unknown>(
    url: string,
    httpOptions: Record<string, unknown> = {},
  ): Observable<HttpResponse<T>> {
    return this.http.get<T>(urlJoin(this.serviceBaseUrl, url), {
      ...httpOptions,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<T>) => {
        this.checkStatus(response, [200]);
        return response;
      }),
      catchError((args) => this.parseError(args))
    );
  }

  post<T = unknown>(
    url: string,
    body: unknown | null = null,
    httpOptions: Record<string, unknown> = {},
  ): Observable<HttpResponse<T>> {
    return this.http.post<T>(urlJoin(this.serviceBaseUrl, url), body, {
      ...httpOptions,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<T>) => {
        this.checkStatus(response, [200, 201]);
        return response;
      }),
      catchError((args) => this.parseError(args))
    );
  }

  put<T = unknown>(
    url: string,
    body: unknown | null = null,
    httpOptions: Record<string, unknown> = {},
  ): Observable<HttpResponse<T>> {
    return this.http.put<T>(urlJoin(this.serviceBaseUrl, url), body, {
      ...httpOptions,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<T>) => {
        this.checkStatus(response, [200, 201]);
        return response;
      }),
      catchError((args) => this.parseError(args))
    );
  }

  patch<T = unknown>(
    url: string,
    body: unknown | null = null,
    httpOptions: Record<string, unknown> = {},
  ): Observable<HttpResponse<T>> {
    return this.http.patch<T>(urlJoin(this.serviceBaseUrl, url), body, {
      ...httpOptions,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<T>) => {
        this.checkStatus(response, [200, 201]);
        return response;
      }),
      catchError((args) => this.parseError(args))
    );
  }

  delete<T = unknown>(
    url: string,
    httpOptions: Record<string, unknown> = {},
  ): Observable<HttpResponse<T>> {
    return this.http.delete<T>(urlJoin(this.serviceBaseUrl, url), {
      ...httpOptions,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<T>) => {
        this.checkStatus(response, [200, 201, 204]);
        return response;
      }),
      catchError((args) => this.parseError(args))
    );
  }

  private checkStatus(response: HttpResponse<any>, statuses: number[] = []) {
    if (!statuses.includes(response.status)) {
      throw httpErrors(response.status, response.statusText);
    }
  }

  parseError(httpError: HttpErrorResponse): Observable<never> {
    switch (httpError.status) {
      case 504:
        this.translateService.get('HTTP_ERROR.504').subscribe((msg) => {
          if (msg) {
            this.toastrService.error(msg);
          }
        });
        break;
      default:
        break;
    }
    return throwError(() => httpError);
  }
}
