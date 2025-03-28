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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, ...antDesignModules],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit {
  ngOnInit(): void {
    this.searchOnInputField();
  }

  searchQuery = '';
  searchInputChange$ = new BehaviorSubject('');

  @Input({
    required: true,
  })
  labelText = '';

  @Output() search: EventEmitter<string> = new EventEmitter();

  @Output() inputSearchValue: EventEmitter<string> = new EventEmitter();

  additionalContent: TemplateRef<unknown> | null = null;

  onSearch(value: string) {
    this.search.emit(value);
  }

  onSearchInputTyping(value: string): void {
    this.searchInputChange$.next(value);
  }

  searchOnInputField() {
    const searchInputChange$ = this.searchInputChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap((value: string) => {
          return new BehaviorSubject(value).asObservable();
        })
      );

    searchInputChange$.subscribe({
      next: (value: string) => {
        this.inputSearchValue.emit(value);
      },
      error: (error: unknown) => {
        // TODO: Implement error handling
        console.log('Error', error);
      },
    });
  }

  setAdditionalContent(content: TemplateRef<unknown>) {
    this.additionalContent = content;
  }
}
