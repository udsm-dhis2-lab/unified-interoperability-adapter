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

import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private showAddSourceForm: boolean = false;
  private showAddInstanceForm: boolean = false;
  private showAddDatasetForm: boolean = false;
  private subject = new Subject<any>();
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor() {}

  toggleAddForm(): void {
    this.showAddSourceForm = !this.showAddSourceForm;
    this.subject.next(this.showAddSourceForm);
  }

  onToggleAddForm(): Observable<any> {
    return this.subject.asObservable();
  }

  toggleAddInstanceForm(): void {
    this.showAddInstanceForm = !this.showAddInstanceForm;
    this.subject.next(this.showAddInstanceForm);
  }

  onToggleAddInstanceForm(): Observable<any> {
    return this.subject.asObservable();
  }

  toggleAddDatasetForm(): void {
    this.showAddDatasetForm = !this.showAddDatasetForm;
    this.subject.next(this.showAddDatasetForm);
  }

  onToggleAddDatasetForm(): Observable<any> {
    return this.subject.asObservable();
  }

  clickEvent(): Observable<any> {
    return fromEvent(document, 'click');
  }

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }
}
