import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './ant-design-modules';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'search-bar',
  standalone: true,
  imports: [CommonModule, ...antDesignModules],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit{
  ngOnInit(): void {
    this.searchOnInputField();
  }
  searchInputChange$ = new BehaviorSubject('');

  @Input({
    required: true,
  })
  labelText: string = '';

  @Output() search: EventEmitter<string> = new EventEmitter();

  @Output() onInputSearchValue: EventEmitter<string> = new EventEmitter();

  additionalContent: TemplateRef<any> | null = null;

  onSearch(value: string) {
    this.search.emit(value);
  }

  onSearchInputTyping(value: string): void {
    this.searchInputChange$.next(value);
  }

  searchOnInputField() {
    this.searchInputChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap((value: string) => {
          this.onInputSearchValue.emit(value);
          return new BehaviorSubject(null).asObservable();
        })
      );
  }

  setAdditionalContent(content: TemplateRef<any>) {
    this.additionalContent = content;
  }
}
