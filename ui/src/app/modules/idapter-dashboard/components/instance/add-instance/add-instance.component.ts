/* BSD 3-Clause License

Copyright (c) 2022, UDSM DHIS2 Lab Tanzania.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { InstanceInterface } from 'src/app/resources/interfaces';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-add-instance',
  templateUrl: './add-instance.component.html',
  styleUrls: ['./add-instance.component.css'],
})
export class AddInstanceComponent implements OnInit {
  name: string = '';
  username: string = '';
  password: string = '';
  url: string = '';
  message: string | undefined;
  organisationUnitCode: string | undefined;

  @Input() showAddInstanceForm?: boolean;

  subscription: Subscription | undefined;

  @Output() onAddInstance: EventEmitter<InstanceInterface> = new EventEmitter();

  verifying: boolean = false;
  verificationResponse: any;

  constructor(
    private uiService?: UiService,
    private instanceService?: InstancesService
  ) {
    this.subscription = this.uiService
      ?.onToggleAddInstanceForm()
      .subscribe((value: boolean) => (this.showAddInstanceForm = value));
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.name === undefined || this.username === '') {
      this.message = 'This field is required';
    }
    if (this.username === undefined || this.username === '') {
      this.message = 'This field is required';
    }
    if (this.url === undefined || this.url === '') {
      this.message = 'This field is required';
    }
    if (this.password === undefined || this.password === '') {
      this.message = 'This field is required';
    }
    if (
      this.organisationUnitCode === undefined ||
      this.organisationUnitCode === ''
    ) {
      this.message = 'This field is required';
    }

    if (
      this.name &&
      this.username &&
      this.url &&
      this.password &&
      this.organisationUnitCode
    ) {
      const newInstance = {
        name: this.name,
        username: this.username,
        password: this.password,
        url: this.url,
        code: this.organisationUnitCode,
      };
      setTimeout(() => {
        this.verificationResponse = null;
      }, 50);
      this.onAddInstance.emit(newInstance);

      this.name = '';
      this.username = '';
      this.password = '';
      this.url = '';
      this.organisationUnitCode = '';
      this.message = undefined;
    }
  }

  onVerify(event: Event): void {
    event.stopPropagation();
    this.verifying = true;
    const parameters = {
      url: this.url,
      username: this.username,
      password: this.password,
      code: this.organisationUnitCode,
    };
    this.verificationResponse = null;
    this.instanceService
      ?.verifyDHIS2Connection(parameters)
      .subscribe((response: any) => {
        if (response) {
          this.verifying = false;
          this.verificationResponse = response;
        }
      });
  }
}
