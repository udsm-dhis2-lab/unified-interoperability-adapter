/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SharedModule } from '../../../../shared/shared.module';
import { Deduplication } from '../../models';
import { DeduplicationManagementService } from '../../services/deduplication-management.service';
import { ClientDetails } from '../../../../../../../../index';

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
  isSubmittingMappingRequest = false;
  alert = {
    show: false,
    type: '',
    message: '',
  };

  constructor(
    private modalRef: NzModalRef,
    private service: DeduplicationManagementService
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
          dateOfBirth: results[0]?.demographicDetails?.dateOfBirth ?? '',
          // age: results[0]?.demographicDetails?.age ?? 0,
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

        console.log(this?.client, 'clients');

        this.loading = false;
      });
  }

  requestMerge() {
    console.log(this.selected);
    const selectedDuplicates = (this.data?.duplicates ?? []).filter((d) =>
      this.selected.includes((d.identifiers ?? {})['HCRCODE'])
    );
    if (!selectedDuplicates?.length) {
      this.showAlert('error', 'Please select duplicates to merge');
      return;
    }
    console.log('selectedDuplicates', selectedDuplicates);
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
      console.log(this.selected);
      return;
    }
    if (this.selected.includes(id)) {
      this.selected = this.selected.filter((s) => s !== id);
    } else {
      this.selected.push(id);
    }
  }
}
