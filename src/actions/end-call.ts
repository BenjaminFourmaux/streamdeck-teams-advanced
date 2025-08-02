import { action, KeyDownEvent, SingletonAction, WillAppearEvent, WillDisappearEvent } from "@elgato/streamdeck";
import { teamsService } from "../services/teams-service";
import { MeetingPermissions, MeetingState } from "../interfaces/teams-types";


/**
 * An action that ends the current Teams call
 */
@action({ UUID: "com.tech-ben.teams-advanced.end-call" })
export class EndCall extends SingletonAction {
    private stateChangeCallback?: (state: MeetingState, permissions: MeetingPermissions) => void;

    override onWillAppear(ev: WillAppearEvent): void | Promise<void> {
        // Update button appearance based on current Teams state
        this.updateButtonAppearance(ev);

        // Register for state changes
        this.stateChangeCallback = (state: MeetingState, permissions: MeetingPermissions) => {
            this.updateButtonAppearance(ev);
        };
        teamsService.onStateChange(this.stateChangeCallback);
    }

    override onWillDisappear(ev: WillDisappearEvent): void | Promise<void> {
        // Clean up state change callback
        if (this.stateChangeCallback) {
            teamsService.removeStateChangeCallback(this.stateChangeCallback);
            this.stateChangeCallback = undefined;
        }
    }

    private updateButtonAppearance(ev: WillAppearEvent): void {
        if (!teamsService.isConnected()) {
            ev.action.setTitle("Teams\nOffline");
            return;
        }

        ev.action.setTitle("End Call");
    }

    override async onKeyDown(ev: KeyDownEvent): Promise<void> {
        try {
            const teamsAPI = teamsService.getTeamsAPI();
            
            // Check if Teams API is available and connected
            if (!teamsAPI) {
                ev.action.showAlert();
                ev.action.setTitle("Teams\nNot Init");
                this.resetTitleAfterDelay(ev);
                return;
            }

            if (!teamsAPI.isConnected()) {
                ev.action.showAlert();
                ev.action.setTitle("Teams\nOffline");
                this.resetTitleAfterDelay(ev);
                return;
            }

            // Send the end call action to Teams
            await teamsAPI.endCall();
            
            // Show success feedback
            ev.action.showOk();
            ev.action.setTitle("Call\nEnded");
            
            this.resetTitleAfterDelay(ev);

        } catch (error) {
            console.error("Failed to end Teams call:", error);
            ev.action.showAlert();
            ev.action.setTitle("Error");
            
            this.resetTitleAfterDelay(ev);
        }
    }

    private resetTitleAfterDelay(ev: KeyDownEvent): void {
        setTimeout(() => {
            this.updateButtonAppearance(ev as any);
        }, 2000);
    }
}
