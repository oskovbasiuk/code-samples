import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, ElementRef, OnInit } from '@angular/core';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ComponentPortal } from '@angular/cdk/portal';
import { filter, merge, Observable, takeUntil, tap } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { NotificationsListComponent } from '@shared/components';
import { NotificationsControllerService } from '@shared/services';
import { DestroyableDirective } from '@shared/directives';

@Component({
  selector: 'app-notification-button',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [OverlayModule, CommonModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent extends DestroyableDirective implements OnInit {
  public unreadNotificationsCount$: Observable<number>;

  private modalOverlay: OverlayRef;

  constructor(
    private overlay: Overlay,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private notificationsService: NotificationsControllerService,
    private router: Router,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initNotifications();
  }

  public openNotifications(): void {
    const notificationsListComponent = this.modalOverlay.attach(new ComponentPortal(NotificationsListComponent));
    this.changeNotificationStatus(notificationsListComponent);
  }

  private changeNotificationStatus(component: ComponentRef<NotificationsListComponent>): void {
    component.instance.changeStatusEmmiter
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.getUnreadNotificationsCount());
  }

  private createModalOverlay(): void {
    this.modalOverlay = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elRef)
        .withPositions([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
        ]),
      hasBackdrop: true,
      backdropClass: 'backdrop-overlay',
    });
  }

  private subscribeToOutsideClick(): void {
    merge(this.modalOverlay.backdropClick(), this.routeChange())
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        tap(() => {
          this.modalOverlay.detach();
        }),
      )
      .subscribe();
  }

  private getUnreadNotificationsCount(): void {
    this.unreadNotificationsCount$ = this.notificationsService.getUnreadNotificationsCount();
  }

  private routeChange(): Observable<unknown> {
    return this.router.events.pipe(
      filter((val) => val instanceof NavigationEnd),
      tap(() => {
        this.modalOverlay.detach();
      }),
    );
  }

  private initNotifications(): void {
    this.createModalOverlay();
    this.subscribeToOutsideClick();
    this.getUnreadNotificationsCount();
  }
}
