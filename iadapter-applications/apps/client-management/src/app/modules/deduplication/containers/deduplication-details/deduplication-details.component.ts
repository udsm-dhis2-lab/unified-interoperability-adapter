import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeduplicationManagementService } from '../../services/deduplication-management.service';
import { SharedModule } from '../../../../shared/shared.module';
import { calculateAge } from '../../../../shared/helpers/helpers';

interface BasicInfo {
  [key: string]: string;
}

interface Deduplicate {
  id: number;
  clientID: string;
  iDNumber: string;
  fullName: string;
  healthRecords: number;
}

interface ExtraInfoSection {
  sectionTitle: string;
  info: { [key: string]: string };
}

@Component({
  selector: 'app-deduplication-details',
  standalone: true,
  imports: [SharedModule],
  animations: [],
  templateUrl: './deduplication-details.component.html',
  styleUrl: './deduplication-details.component.css',
})
export class DeduplicationDetailsComponent implements OnInit {
  alert = {
    show: false,
    type: '',
    message: '',
  };

  isSubmittingMappingRequest = false;

  basicInfo: BasicInfo = {
    'Case ID': 'IBS_00297209',
    'FUll name': 'Herman Moshi Moshi',
    Sex: 'Male',
    'Date of Birth': '25/06/1989',
    Age: '35 Years',
  };

  listOfData: Deduplicate[] = [
    {
      id: 1,
      clientID: 'IBS_00297209',
      iDNumber: '97782H',
      fullName: 'Herman Moshi Moshi',
      healthRecords: 3,
    },
    {
      id: 2,
      clientID: 'IBS_00297209',
      iDNumber: '97782H',
      fullName: 'Herman Moshi Moshi',
      healthRecords: 2,
    },
    {
      id: 3,
      clientID: 'IBS_00297209',
      iDNumber: '97782H',
      fullName: 'Herman Moshi Moshi',
      healthRecords: 7,
    },
  ];

  extraInfo: ExtraInfoSection[] = [
    {
      sectionTitle: 'Contact Information',
      info: {
        'Phone Number': '+255-456-7890',
        Email: 'john.doe@example.com',
        'Permanet address': 'Dar es salaam, Tanzania',
        'Current address': 'Morogoro, Tanzania',
        Occupation: 'Software Engineer',
        Nationality: 'Tanzanian',
      },
    },
    {
      sectionTitle: 'Next of Kin',
      info: {
        'Full name': 'Herman Moshi Moshi',
        Relationship: 'Brother',
        'Phone number': '+255-456-7890',
      },
    },
    {
      sectionTitle: 'Insurance Type',
      info: {
        'Insuarance Provider': 'NSSF',
        'Insuarance Number': 'IBS_00297209',
        'Policy Number': 'IBS_00297209',
        'Group Number': 'IBS_00297209',
        Region: 'Tanzania',
      },
    },
  ];

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly Deduplicate[] = [];
  setOfCheckedId = new Set<number>();

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly Deduplicate[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  constructor(
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private deduplicateService: DeduplicationManagementService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params['deduplicate']) {
        const deduplicate = JSON.parse(params['deduplicate']);
        this.basicInfo = {
          // 'Case ID': deduplicate['caseID'],
          'Full name':
            (deduplicate['fname'] ?? '') +
            ' ' +
            (deduplicate['mname'] ?? '') +
            ' ' +
            (deduplicate['surname'] ?? ''),
          Sex: deduplicate['gender'],
          'Date of Birth': deduplicate['dateOfBirth'],
          Age: calculateAge(deduplicate['dateOfBirth']) + ' years',
        };

        this.extraInfo = [
          {
            sectionTitle: 'Contact Information',
            info: {
              'Phone Number': deduplicate['phoneNumbers'],
              Email: deduplicate['emails'],
              addresses: deduplicate['addresses'],
              Occupation: deduplicate['occupation'],
              Nationality: deduplicate['nationality'],
            },
          },
        ];
      }
    });
  }
  backToList() {
    this.router.navigate(['']);
  }

  warning(content: string, action: string, payLoad?: any): void {
    this.modal.warning({
      nzTitle: 'Warning',
      nzContent: content,
      nzCancelText: 'Cancel',
      nzOkText: 'Yes',
      nzOnOk: () =>
        action === 'requestMerge'
          ? this.createMappingRequest(payLoad)
          : this.success(),
    });
  }

  success(): void {
    this.modal.success({
      nzTitle: 'Request for merge has been sent successfully',
      nzContent: 'you will be notified once its done',
      nzOkText: 'Done',
    });
  }

  objectKeys(obj: any): string[] {
    return Object?.keys(obj) || [];
  }

  createMappingRequest(payload: any) {
    this.isSubmittingMappingRequest = true;
    this.alert = {
      show: true,
      type: 'info',
      message: 'Creating mapping request',
    };
    return this.deduplicateService.createMergeRequest(payload).subscribe({
      next: () => {
        this.alert = {
          show: true,
          type: 'success',
          message: 'Mapping request was sent successfully',
        };
      },
      error: (error) => {
        this.alert = {
          show: true,
          type: 'error',
          message: error.message,
        };
      },
    });
  }

  onCloseAlert() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }
}
