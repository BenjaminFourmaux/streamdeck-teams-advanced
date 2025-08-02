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

    /**
     * Update button appearance based on current state
     */
    private updateButtonAppearance(ev: WillAppearEvent): void {
        
    }

    override async onKeyDown(ev: KeyDownEvent): Promise<void> {
        try {
            const teamsAPI = teamsService.getTeamsAPI();
            
            // Check if Teams API is available and connected
            if (!teamsAPI || teamsAPI.isConnected()) {
                ev.action.showAlert();
                return;
            }


            // Send the leave call action to Teams
            await teamsAPI.leaveCallEvent();
            
            // Show success feedback
            ev.action.showOk();
            
        } catch (error) {
            console.error("Failed to end Teams call:", error);
            ev.action.showAlert();
        }
    }
}
