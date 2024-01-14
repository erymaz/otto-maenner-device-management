import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { ActionItem } from '../models';

@Component({
  selector: 'app-action-search',
  templateUrl: './action-search.component.html',
  styleUrls: ['./action-search.component.scss']
})
export class ActionSearchComponent implements OnInit, OnDestroy {
  @Input() debounceTime = 300;
  @Input() actionItem!: ActionItem;
  @Output() action = new EventEmitter<ActionItem>();
  form!: FormGroup;
  item!: ActionItem;

  private unsubscribe = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder
  ) { }

  ngOnInit() {
    this.item = cloneDeep(this.actionItem) || {};
    this.form = this.fb.group({
      search: null
    });
    this.search?.valueChanges.pipe(
      takeUntil(this.unsubscribe), debounceTime(this.debounceTime), distinctUntilChanged()
    ).subscribe((val: string) => {
      this.item.value = (val || '').trim();
      this.action.emit(this.item);
    });
  }

  get search() {
    return this.form.get('search');
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
