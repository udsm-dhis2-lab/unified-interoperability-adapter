import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SharedModule } from '../../../../shared/shared.module';
import { Deduplication } from '../../models';

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
  templateUrl: './deduplication-details.component.html',
  styleUrls: ['./deduplication-details.component.css'],
})
export class DeduplicationDetailsComponent implements OnInit {
  data!: Deduplication;
  client?: Client;
  selected: string[] = [];
  isSubmittingMappingRequest = false;
  alert = {
    show: false,
    type: '',
    message: '',
  };

  constructor(private modalRef: NzModalRef) {}

  ngOnInit() {
    const modalData = this.modalRef.getConfig().nzData;
    this.data = modalData?.data;
    this.client = {
      id: modalData?.data?.id ?? '',
      fullName: modalData?.data?.name ?? '',
      sex: modalData?.data?.gender ?? '',
      dateOfBirth: '',
      age: 0,
    } as Client;
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

  select(id: string) {
    if (this.selected.includes(id)) {
      this.selected = this.selected.filter((s) => s !== id);
    } else {
      this.selected.push(id);
    }
  }
}
