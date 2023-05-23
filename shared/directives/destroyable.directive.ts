import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class DestroyableDirective implements OnDestroy {
  protected readonly ngUnsubscribe$: Subject<void> = new Subject<void>();

  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
