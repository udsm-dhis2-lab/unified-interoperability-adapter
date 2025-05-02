import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { ClientManagementService } from '../../services/client-management.service';
import { SharedModule } from '../../../../shared/shared.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DicomViewerComponent } from '../dicom-viewer/dicom-viewer.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    SharedModule,
    NzTabsModule,
    NzCollapseModule,
    NzEmptyModule,
    NzUploadModule,
    NzIconModule,
  ],
  providers: [ClientManagementService],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent implements OnInit {
  loading = false;

  parentRoute?: string;

  expanded = false;

  client?: any;

  basicInfo: any;
  identifiers: any;
  appointmentDetails: any;

  extraInfo: any;

  hcrCode!: string;

  files: { name: string; url: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientManagementService: ClientManagementService,
    private messageService: NzMessageService,
    private modal: NzModalService
  ) {}
  backToList() {
    this.router.navigate([this.parentRoute]);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.loading = true;
      if (params) {
        const client = params['client'] ?? '';
        const clientID = client?.startsWith('HCR')
          ? client
          : JSON.parse(client);

        this.parentRoute = params['parentRoute'];
        this.hcrCode = clientID;

        this.clientManagementService
          .getClientById(clientID)
          .subscribe((client: any) => {
            this.client = client?.listOfClients[0] || {};
            this.files = this.client?.demographicDetails?.files ?? [];
            this.basicInfo = this.formatApiResponse(this.client)[
              'Demographic Details'
            ];

            this.appointmentDetails = this.formatApiResponse(this.client)[
              'Appointments'
            ];

            this.loading = false;
          });
      }
    });
  }

  drop(event: any) {
    console.log(event);
  }

  objectKeys(obj: any): string[] {
    return Object?.keys(obj) || [];
  }

  showDeleteConfirm(
    nzContent: string,
    file: { name: string; url: string }
  ): void {
    console.log(file);
    this.modal.create({
      nzTitle: 'Delete Confirmation',
      nzContent,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzCentered: true,
      nzClassName: 'custom-confirm-modal',
    });
  }

  // Utility function to format keys and values
  formatApiResponse(result: any): { [key: string]: any } {
    if (!result) {
      return {};
    }

    const formattedResponse: { [key: string]: any } = {};

    return {
      // {`${id.type}: ${id.id}`}
      Identifiers: result.demographicDetails.identifiers?.map((id: any) => {
        return {
          Type: id.type,
          Number: id.id,
        };
      }),

      Appointments: result?.demographicDetails?.appointmentDetails || '-',
      'Contact People':
        result.demographicDetails.contactPeople?.join(', ') || '-',
      'Payment Details':
        result.demographicDetails.paymentDetails?.join(', ') || '-',

      'Demographic Details': {
        'Full Name': result.demographicDetails.fullName,
        'Client ID': result.demographicDetails.clientID,
        Gender: result.demographicDetails.gender,
        'Date of Birth': result.demographicDetails.dateOfBirth,
        'Marital Status': result.demographicDetails.maritalStatus || '-',
        'Phone Numbers':
          result.demographicDetails.phoneNumbers?.join(', ') || '-',
        Emails: result.demographicDetails.emails?.join(', ') || '-',
        NIDA: result.demographicDetails.nida || '-',
        Occupation: result.demographicDetails.occupation || '-',
        Nationality: result.demographicDetails.nationality || '-',
        'Related Clients':
          result.demographicDetails.relatedClients?.join(', ') || '-',
        Appointment: result.demographicDetails.appointment || '-',
        Address:
          result?.demographicDetails?.addresses?.map((address: any) => {
            const addressParts = [
              address?.village,
              address?.ward,
              address?.district,
              address?.region,
              address?.city,
              address?.state,
              address?.country,
            ].filter(
              (part) =>
                part && part.trim() !== '' && part.trim() !== 'undefined'
            ); // Filter out null, undefined, and empty strings

            return addressParts.length > 0 ? addressParts.join(', ') : '-';
          }) || '-',
      },

      'Facility Details': {
        'Facility Code': result.facilityDetails.code || '-',
        'Facility Name': result.facilityDetails.name || '-',
      },
    };

    return formattedResponse;
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.messageService.success(
        `${info.file.name} file uploaded successfully`
      );
      console.log(info.file.response);
      this.files.push({
        name: info.file.name,
        url: info.file.response?.fileName,
      });
    } else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    }
  }

  getAddress() {
    return `../../../../../api/v1/files/${this.hcrCode}/uploads`;
  }

  viewFile(file: { name: string; url: string }) {
    this.modal.create({
      nzTitle: file.name,
      nzContent: DicomViewerComponent,
      nzWidth: '40%',
      nzMaskClosable: false,
      nzData: {
        data: `../../../../../api/v1/files/${file.url}/downloads?id=${this.hcrCode}`,
      },
      nzFooter: null,
    });
  }
}
