import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { calculateAge } from 'apps/client-management/src/app/shared/helpers/helpers';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { ClientManagementService } from '../../services/client-management.service';

interface BasicInfo {
  [key: string]: string;
}

interface ExtraInfoSection {
  sectionTitle: string;
  info: { [key: string]: string };
}

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [SharedModule],
  providers: [ClientManagementService],
  templateUrl: './referral-details.component.html',
  styleUrl: './referral-details.component.css',
})
export class ClientDetailsComponent implements OnInit {
  basicInfo: BasicInfo = {};

  client?: any;

  extraInfo: ExtraInfoSection[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private clientManagementService: ClientManagementService,

  ) {}
  backToList() {
    this.router.navigate(['']);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {

      console.log(JSON.parse(params['client']));
      if (params) {
        const clientID = JSON.parse(params['client']);

        this.clientManagementService.getClientById(clientID).subscribe(
          (client: any) => {

            this.client = client.listOfClients[0];

            console.log(this.client);
          }
        )
      }
    });
  }
}


