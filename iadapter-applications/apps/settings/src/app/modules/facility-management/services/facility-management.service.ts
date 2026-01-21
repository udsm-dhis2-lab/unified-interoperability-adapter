import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    FacilityListResponse,
    FacilityResponse,
    FacilityRegistration,
    MediatorConfig,
} from '../models/facility.model';

@Injectable({
    providedIn: 'root',
})
export class FacilityManagementService {
    private readonly baseUrl = '/api/v1/facilities';

    constructor(private http: HttpClient) { }

    getFacilities(page: number = 1, pageSize: number = 50): Observable<FacilityListResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<FacilityListResponse>(this.baseUrl, { params });
    }

    getFacilityByCode(code: string): Observable<FacilityResponse> {
        return this.http.get<FacilityResponse>(`${this.baseUrl}/${code}`);
    }

    registerFacility(facility: FacilityRegistration): Observable<FacilityResponse> {
        return this.http.post<FacilityResponse>(this.baseUrl, facility);
    }

    updateFacilityAccess(id: string, allowed: boolean): Observable<FacilityResponse> {
        const params = new HttpParams().set('allowed', allowed.toString());
        return this.http.patch<FacilityResponse>(`${this.baseUrl}/${id}/access`, null, { params });
    }

    configureMediator(code: string, config: MediatorConfig): Observable<FacilityResponse> {
        return this.http.put<FacilityResponse>(`${this.baseUrl}/${code}/mediator`, config);
    }

    deleteFacility(code: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${code}`);
    }
}
