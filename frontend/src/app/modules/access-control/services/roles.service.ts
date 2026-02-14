import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  
  http = inject(HttpClient);

  getRoles(){
    return this.http.get("/api/v1/users/roles")
  }
}
