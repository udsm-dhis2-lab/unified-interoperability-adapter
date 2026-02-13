import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);
  


  getUsers(userUuid?: string){
    return this.http.get(`/api/v1/users/${userUuid ? userUuid : ''}`, )
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
