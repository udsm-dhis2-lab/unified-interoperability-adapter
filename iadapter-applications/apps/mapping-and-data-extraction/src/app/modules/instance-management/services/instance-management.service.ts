import { Injectable } from '@angular/core';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { Endpoints } from '../../../shared';

@Injectable({
  providedIn: 'root',
})
export class InstanceManagementService {
  instanceUrl: string = Endpoints.INSTANCES;
  
  constructor(httpClient: HduHttpService) {}
}
