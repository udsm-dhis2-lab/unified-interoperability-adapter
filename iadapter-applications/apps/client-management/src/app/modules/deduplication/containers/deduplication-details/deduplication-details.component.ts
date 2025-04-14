/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SharedModule } from '../../../../shared/shared.module';
import { Deduplication } from '../../models';
import { DeduplicationManagementService } from '../../services/deduplication-management.service';
import { ClientDetails } from '../../interfaces/client.interface';
import { Duplicate } from '../../models/deduplication.model';

interface Client {
  id: string;
  fullName: string;
  sex: string;
  dateOfBirth: string;
  age: number;
  contactInfo: {
    phoneNumber: string;
    email: string;
    permanentAddress: string;
    currentAddress: string;
  };
  nextOfKin: {
    fullName: string;
    relationship: string;
    phoneNumber: string;
  };
  duplicates: Deduplication[];
}

@Component({
  selector: 'app-deduplication-details',
  standalone: true,
  imports: [SharedModule, FormsModule],
  providers: [DeduplicationManagementService],
  templateUrl: './deduplication-details.component.html',
  styleUrls: ['./deduplication-details.component.css'],
})
export class DeduplicationDetailsComponent implements OnInit {
  data!: Deduplication;
  client?: Client;
  selected: string[] = [];
  loading = true;
  deleting = false;
  isSubmittingMappingRequest = false;
  alert = {
    show: false,
    type: '',
    message: '',
  };

  constructor(
    private modalRef: NzModalRef,
    private service: DeduplicationManagementService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    const modalData = this.modalRef.getConfig().nzData;
    this.data = modalData?.data;
    this.data.duplicates = (modalData?.data?.duplicates ?? []).filter(
      (d: Deduplication) =>
        (d.identifiers ?? {})['HCRCODE'] !== modalData?.data?.id
    );
    this.service
      .getClientById(modalData?.data?.id ?? '')
      .subscribe((client: ClientDetails) => {
        const { results } = client;

        const permanentAddress = (
          results[0]?.demographicDetails?.addresses ?? []
        ).find(({ category }) => category == 'Permanent');
        const currentAddress = (
          results[0]?.demographicDetails?.addresses ?? []
        ).find(({ category }) => category == 'Temporary');
        this.client = {
          id: modalData?.data?.id ?? '',
          fullName: `${results[0]?.demographicDetails?.firstName ?? ''} ${
            results[0]?.demographicDetails?.lastName ?? ''
          }`,
          sex: results[0]?.demographicDetails?.gender ?? '',
          dateOfBirth: this.getDateOfBirth(
            results[0]?.demographicDetails?.dateOfBirth ?? ''
          ),
          age: this.calculateDetailedAge(
            results[0]?.demographicDetails?.dateOfBirth ?? ''
          ),
          contactInfo: {
            phoneNumber:
              (results[0]?.demographicDetails.phoneNumbers ?? []).join(',') ??
              '',
            email:
              (results[0]?.demographicDetails?.emails ?? [])?.join(',') ?? '',
            permanentAddress: permanentAddress?.district ?? '',
            currentAddress: currentAddress?.district ?? '',
          },
          nextOfKin: {
            fullName:
              `${
                results[0].demographicDetails.contactPeople?.[0].firstName ?? ''
              }` +
              ' ' +
              `${
                results[0].demographicDetails.contactPeople?.[0].lastName ?? ''
              }`,
            phoneNumber:
              results[0]?.demographicDetails?.contactPeople?.[0].phoneNumbers?.join(
                ','
              ) ?? '',
            relationShip:
              results[0]?.demographicDetails?.contactPeople?.[0].relationShip ??
              '',
          },
        } as unknown as Client;

        this.loading = false;
      });
  }

  requestMerge() {
    const selectedDuplicates = (this.data?.duplicates ?? []).filter((d) =>
      this.selected.includes((d.identifiers ?? {})['HCRCODE'])
    );
    if (!selectedDuplicates?.length) {
      this.showAlert('error', 'Please select duplicates to merge');
      return;
    }
    this.showAlert('info', 'Merge request submitted');
  }

  merge() {
    const selectedDuplicates = (this.data.duplicates ?? []).filter((d) => d.id);
    if (!selectedDuplicates?.length) {
      this.showAlert('error', 'Please select duplicates to merge');
      return;
    }
    this.showAlert('success', 'Records merged successfully');
  }

  showAlert(type: string, message: string) {
    this.alert = {
      show: true,
      type,
      message,
    };
  }

  onCloseAlert() {
    this.alert.show = false;
  }

  closeModal(): void {
    this.modalRef.close();
  }

  select(id: string, all?: boolean) {
    if (all) {
      this.selected =
        this.selected.length == this.data.duplicates?.length
          ? []
          : (this.data.duplicates ?? []).map(
              (d) => (d.identifiers ?? {})['HCRCODE']
            );
      return;
    }
    if (this.selected.includes(id)) {
      this.selected = this.selected.filter((s) => s !== id);
    } else {
      this.selected.push(id);
    }
  }

  calculateDetailedAge = (birthDate: Date | string): string => {
    const birthDateObj =
      typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

    if (isNaN(birthDateObj.getTime())) {
      return '-';
    }

    const today = new Date();
    let years = today.getFullYear() - birthDateObj.getFullYear();
    let months = today.getMonth() - birthDateObj.getMonth();
    let days = today.getDate() - birthDateObj.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }
    if (years == 0) return `${months} ${months == 1 ? 'Month' : 'Months'}`;
    if (months == 0)
      return `${years} ${years > 1 ? 'Years' : 'Year'} | ${days} ${
        days == 1 ? 'Day' : 'Days'
      }`;
    if (days == 0)
      return `${years} ${years == 1 ? 'Year' : 'Years'} | ${months} ${
        months > 1 ? 'Months' : 'Month'
      }`;
    return `${years} ${years > 1 ? 'Years' : 'Year'} | ${months} ${
      months > 1 ? 'Months' : 'Month'
    } | ${days} ${days > 1 ? 'Days' : 'Day'}`;
  };

  getDateOfBirth = (birthDate: Date | string): string => {
    const birthDateObj =
      typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    if (isNaN(birthDateObj.getTime())) {
      return '-';
    }
    return birthDateObj.toDateString();
  };

  deleteDuplicate = (duplicate: Duplicate, showMessage = true): any => {
    if (!duplicate?.id) return;
    this.deleting = true;
    this.service
      .runProcess('FHIR-DELETE-PATIENT', {
        hcr: (duplicate.identifiers ?? {})['HCRCODE'],
      })
      .subscribe((res) => {
        this.service
          .runProcess('DEDUPLICATION', {
            filters: [
              { key: 'ids', value: [duplicate.id] },
              { key: 'delete', value: [true] },
            ],
          })
          .subscribe(() => {
            this.data.duplicates = (this.data.duplicates ?? []).filter(
              (d) => d.id !== duplicate.id
            );
            this.data.total = this.data.duplicates?.length?.toString() ?? '0';
            if (showMessage) {
              this.deleting = false;
              this.showAlert('success', 'Duplicate deleted successfully');
            }
          });
        return res;
      });
  };

  deleteAllDuplicates = async () => {
    this.deleting = true;
    try {
      for (const selectedDuplicate of this.selected) {
        const duplicate = (this.data.duplicates ?? []).find(
          (d) => (d.identifiers ?? {})['HCRCODE'] == selectedDuplicate
        );
        if (!duplicate) {
          this.showAlert(
            'error',
            `Duplicate not found: [${selectedDuplicate}]`
          );
          continue;
        }
        const res = await this.deleteDuplicate(duplicate, false)?.toPromise();
        if (res?.error) {
          this.showAlert(
            'error',
            `Error deleting duplicate: [${duplicate.identifiers['HCRCODE']}]`
          );
          continue;
        }
      }
      this.deleting = false;
      this.showAlert('success', 'Duplicates deleted successfully');
    } catch (e: any) {
      this.showAlert('error', `Error deleting duplicates: ${e?.message}`);
    }
  };

  showDeleteConfirm(
    nzContent: string,
    all = true,
    duplicate?: Duplicate
  ): void {
    this.modal.create({
      nzTitle: 'Delete Confirmation',
      nzContent,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        all
          ? this.deleteAllDuplicates()
          : this.deleteDuplicate(duplicate as Duplicate),
      nzCancelText: 'Cancel',
      nzCentered: true,
      nzClassName: 'custom-confirm-modal',
      // nzStyle: { top: '5%' },
    });
  }
}
