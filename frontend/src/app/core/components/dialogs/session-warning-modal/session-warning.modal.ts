import { Component, computed, inject } from "@angular/core";
import { UserActivityService } from "../../../services";
import { ZORRO_MODULES } from "@hdu/shared";

@Component({
    selector: 'app-session-warning-modal',
    standalone: true,
    imports: [
        ...ZORRO_MODULES
    ],
    templateUrl: './session-warning-modal.component.html',
    styleUrl: './session-warning-modal.component.scss'
})
export class SessionWarningModalComponent {
    private userActivityService = inject(UserActivityService);

    showModal = this.userActivityService.showWarningModal;


    secondsRemaining = this.userActivityService.secondsRemaining;

    formattedTime = computed(() => {
        const secs = this.secondsRemaining();
        const min = Math.floor(secs / 60);
        const sec = secs % 60;
        return `${min}:${sec.toString().padStart(2, '0')} `;
    });

    progressPercentage = computed(() => {
        const secs = this.secondsRemaining();
        const remainingTime = secs;
        const elapsedTime = 30 - remainingTime;
        return Math.max(0, Math.min(100, (elapsedTime / 30) * 100));
    });

    extendSession(): void {
        this.userActivityService.extendSession();
    }

    logoutNow(): void {
        this.userActivityService.logoutNow();
    }
}