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

import { InstanceInterface } from 'src/app/resources/interfaces';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstancesService } from 'src/app/services/instances/instances.service';

@Component({
  selector: 'app-edit-instance',
  templateUrl: './edit-instance.component.html',
  styleUrls: ['./edit-instance.component.css'],
})
export class EditInstanceComponent {
  id: number | undefined;
  name: string | undefined;
  username: string | undefined;
  password: string | undefined;
  url: string | undefined;
  organisationUnitCode: string | undefined;

  verifying: boolean = false;
  verificationResponse: any;

  constructor(
    public dialogRef: MatDialogRef<EditInstanceComponent>,
    @Inject(MAT_DIALOG_DATA) public instanceToEdit: InstanceInterface,
    private instanceService: InstancesService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveInstance(instance: InstanceInterface): void {
    let editedInstance = {
      name: instance.name,
      username: instance.username,
      password: instance.password,
      url: instance.url,
      code: instance.code,
    };
  }

  onVerify(event: Event): void {
    event.stopPropagation();
    this.verifying = true;
    const parameters = {
      url: this.instanceToEdit?.url,
      username: this.instanceToEdit?.username,
      password: this.instanceToEdit?.password,
      code: this.instanceToEdit?.code,
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
