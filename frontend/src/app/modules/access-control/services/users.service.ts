import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);
  


  getUsers(uuid?: string, params?: {
    page?: number,
    pageSize?: number,
    search?: string
  }){
    let parameters = new HttpParams();
    
    if(params){
      Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
              parameters = parameters.set(key, value.toString());
          }
      });
    }
    return this.http.get(`/api/v1/users${uuid ? '/'+uuid : ''}`, { params: parameters})
  }

  saveUser(user: any){
    return this.http.post("/api/v1/users", user)
  }

  updateUser(user: any){
    const {uuid, ...userObject} = user;
    return this.http.put(`/api/v1/users/${uuid}`, userObject)
  }

  getRoles(){
    return this.http.get("/api/v1/users/roles")
  }

}
