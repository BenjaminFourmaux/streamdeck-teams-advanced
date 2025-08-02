import { MeetingPermissions, MeetingState } from "../interfaces/teams-types";
import { Teams } from "./teams";

/**
 * Singleton service to manage the Teams API instance
 */
class TeamsService {
    private static instance: TeamsService;
    private teamsAPI: Teams | null = null;

    private constructor() {}

    public static getInstance(): TeamsService {
        if (!TeamsService.instance) {
            TeamsService.instance = new TeamsService();
        }
        return TeamsService.instance;
    }

    public async initialize(token: string, manufacturer: string, device: string, app: string, appVersion: string): Promise<void> {
        this.teamsAPI = new Teams(token, manufacturer, device, app, appVersion);
        await this.teamsAPI.connect();
    }

    public getTeamsAPI(): Teams | null {
        return this.teamsAPI;
    }

    public isConnected(): boolean {
        return this.teamsAPI?.isConnected() ?? false;
    }

    // State access methods
    public getMeetingState(): MeetingState | null {
        return this.teamsAPI?.getMeetingState() ?? null;
    }

    public getMeetingPermissions(): MeetingPermissions | null {
        return this.teamsAPI?.getMeetingPermissions() ?? null;
    }

    // State change notifications
    public onStateChange(callback: (state: MeetingState, permissions: MeetingPermissions) => void): void {
        this.teamsAPI?.onStateChange(callback);
    }

    public removeStateChangeCallback(callback: (state: MeetingState, permissions: MeetingPermissions) => void): void {
        this.teamsAPI?.removeStateChangeCallback(callback);
    }
}

export const teamsService = TeamsService.getInstance();
