import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  
  http = inject(HttpClient);

  getRoles(params: {
    paging?: boolean,
    page?: number,
    pageSize?: number,
    search?: string,
    withPrivileges?: boolean

  }){
    params.paging = params.paging === undefined ? true : params.paging;
    params.withPrivileges = true;

    let parameters = new HttpParams();

    if(params){
      Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
              parameters = parameters.set(key, value.toString());
          }
      });
    }

    return this.http.get("/api/v1/users/roles", { params: parameters })
  }

  getPrivileges(){
    return this.http.get("/api/v1/users/privileges")
  }

  createRole(roleData: any){
    return this.http.post("/api/v1/users/roles", roleData);
  }

  getRole(roleUuid: string){
    return this.http.get(`/api/v1/users/roles/${roleUuid}`);
  }

  updateRole(roleUuid: string, roleData: any){
    return this.http.put(`/api/v1/users/roles/${roleUuid}`, roleData);
  }

  deleteRole(roleUuid: string){
    return this.http.delete(`/api/v1/users/roles/${roleUuid}`);
  }
}
