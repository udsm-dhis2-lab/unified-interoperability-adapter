import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import { AuthService } from "./auth.service";
import { debounceTime, fromEvent, interval, merge, Subject, Subscription, takeUntil } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserActivityService implements OnDestroy {
    private authService = inject(AuthService);

    private readonly TOKEN_REFRESH_THRESHOLD = 30;
    private readonly IDLE_TIMEOUT_MS = 30000;

    public showWarningModal = signal(false);
    public secondsRemaining = signal(0);

    private lastActivityTimestamp: number = Date.now();
    private isRefreshing = false;
    private timerSubscription!: Subscription;
    private destroy$ = new Subject<void>();

    constructor() {
        this.setupActivityListeners();
    }

    startIdleTimer(): void {
        /*Restart the idle timer 
        * This will stop any existing timer and start a new one. 
        */
        this.stopIdleTimer();
        this.lastActivityTimestamp = Date.now();

        this.timerSubscription = interval(1000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                if (this.isRefreshing) return;

                const tokenTimeLeft = Math.floor(this.calculateTokenTimeLeft());
                const idleTime = Date.now() - this.lastActivityTimestamp;
                const isIdle = idleTime >= this.IDLE_TIMEOUT_MS;

                this.secondsRemaining.set(tokenTimeLeft);

                if (tokenTimeLeft <= this.TOKEN_REFRESH_THRESHOLD && tokenTimeLeft > 0) {
                    if (isIdle) {
                        this.showWarningModal.set(true);
                    } else {
                        this.refreshToken();
                    }
                }

                if (tokenTimeLeft <= 0) {
                    this.forceLogout('token');
                }
            });
    }

    private setupActivityListeners(): void {
        /*
        * Listen to user activity events to reset idle timer
        * */
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

        merge(...events.map(event => fromEvent(document, event)))
            .pipe(
                debounceTime(100),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {

                if (this.showWarningModal()) {
                    return;
                } else {
                    this.lastActivityTimestamp = Date.now();
                }

                /* Allow automatic extension of session only if not refreshing and user touches anything:
                * This is meant to prevent automatic extension of session while user is idle on warning modal.
                * Allow it if you want to extend session upon any activity even on warning modal.
                * It will trigger session extension even if user is just moving mouse on modal without explicitly clicking "Extend Session" button.
                * Which means user might unknowingly extend session just by doing anything even when on modal.
                * 
                * */
                // if (this.showWarningModal() && !this.isRefreshing) {
                //   this.extendSession();
                // }
            });
    }

    extendSession(): void {
        this.showWarningModal.set(false);
        this.refreshToken();
    }

    logoutNow(): void {
        this.showWarningModal.set(false);
        this.forceLogout('manual');
    }

    private calculateTokenTimeLeft(): number {
        const expiryTime = localStorage.getItem("refresh_token_expiry");
        if (expiryTime) {
            const expiryTimestamp = parseFloat(expiryTime);
            const currentTime = new Date().getTime();
            const diffInSeconds = Math.max(0, ((expiryTimestamp - currentTime) / 1000) - 1120)
            return Math.abs(diffInSeconds);
        }
        return 0;
    }

    private refreshToken(): void {
        if (this.isRefreshing) return;
        this.isRefreshing = true;

        this.authService.refresh_token().subscribe({
            next: (response) => {
                if (this.authService.saveAuthData) {
                    this.authService.saveAuthData(response);
                }
                this.isRefreshing = false;
                this.lastActivityTimestamp = Date.now();
                this.showWarningModal.set(false);
                this.startIdleTimer();
            },
            error: () => {
                this.isRefreshing = false;
                this.forceLogout('token');
            }
        });
    }

    private forceLogout(reason: 'idle' | 'token' | 'manual'): void {
        this.stopIdleTimer();
        this.authService.logout(false);
    }

    stopIdleTimer(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        this.showWarningModal.set(false);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.stopIdleTimer();
    }
}