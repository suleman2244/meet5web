// src/app/core/services/dialog.service.ts
// Manages the visibility of the Create Activity dialog globally.
// Any component can call open/close — the dialog component subscribes reactively.
import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private _isOpen = signal(false);

    /** Components read this to know if the dialog should be rendered */
    readonly isOpen = this._isOpen.asReadonly();

    open(): void {
        this._isOpen.set(true);
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    close(): void {
        this._isOpen.set(false);
        document.body.style.overflow = '';
    }
}
