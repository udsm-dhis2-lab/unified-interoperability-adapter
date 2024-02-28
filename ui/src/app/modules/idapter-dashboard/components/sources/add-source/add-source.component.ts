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

import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { SourceInterface } from 'src/app/models/source.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.css'],
})
export class AddSourceComponent implements OnInit {
  // dialogRef!: MatDialogRef<AddSourceComponent>;

  type: string = '';
  username: string = '';
  password: string = '';
  url: string = '';
  active: boolean = false;
  port!: number;
  showAddForm: boolean = false;
  subscription: Subscription | undefined;
  message: string | undefined;

  @Output() onAddSource: EventEmitter<SourceInterface> = new EventEmitter();

  constructor(
    private uiService?: UiService,
    ) {
    this.subscription = this.uiService
      ?.onToggleAddForm()
      .subscribe((value) => (this.showAddForm = value));
  }


  ngOnInit(): void {}

 
  onSubmit() {
    if (this.type === undefined || this.type === '') {
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

    if (this.type && this.username && this.url && this.password) {
      const newSource = {
        type: this.type,
        username: this.username,
        password: this.password,
        url: this.url,
      };

      this.onAddSource.emit(newSource);

      this.type = '';
      this.username = '';
      this.password = '';
      this.url = '';
      this.message = '';
    }

    
  }

 
}
