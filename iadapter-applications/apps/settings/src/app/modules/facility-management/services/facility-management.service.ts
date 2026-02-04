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
    private readonly hfr_url = '/api/v1/hfr-facilities';

    constructor(private http: HttpClient) { }

    getFacilities(page: number = 1, pageSize: number = 50, search: string = ''): Observable<FacilityListResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('pageSize', pageSize.toString());

        if (search && search.trim()) {
            params = params.set('search', search.trim());
        }

        return this.http.get<FacilityListResponse>(this.baseUrl, { params });
    }

    getHfrFacilities(name?: string, code?: string, pageNo?: number): Observable<any>{
        let params = '';
        params = !params?.length && name ? `?name=${name}` : name ? `${params}&name=${name}` : params;
        params = !params?.length && code ? `?code=${code}` : code ? `${params}&code=${code}` : params;
        params = !params?.length && pageNo ? `?page=${pageNo}` : pageNo ? `${params}&page=${pageNo}` : params;
        return this.http.get(`${this.hfr_url}${params}`)
    }

    getFacilityById(id: string): Observable<FacilityResponse> {
        return this.http.get<FacilityResponse>(`${this.baseUrl}/${id}`);
    }

    registerFacility(facility: FacilityRegistration): Observable<FacilityResponse> {
        return this.http.post<FacilityResponse>(this.baseUrl, facility);
    }

    updateFacilityAccess(id: string, allowed: boolean): Observable<FacilityResponse> {
        const params = new HttpParams().set('allowed', allowed.toString());
        return this.http.patch<FacilityResponse>(`${this.baseUrl}/${id}/access`, null, { params });
    }

    configureMediator(id: string, config: MediatorConfig): Observable<FacilityResponse> {
        return this.http.put<FacilityResponse>(`${this.baseUrl}/${id}/mediator`, config);
    }

    deleteFacility(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }
}
