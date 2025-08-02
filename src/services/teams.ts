import streamDeck from "@elgato/streamdeck";
import WebSocket from 'ws';
import { MeetingPermissions, MeetingState, MeetingUpdate, TeamsMessage } from '../interfaces/teams-types';

/**
 * Teams Local API, manage websocket connections and actions.
 */
export class Teams {
    public static readonly baseUrl = "ws://127.0.0.1:8124";
    public websocketUri: string;
    private webSocket: WebSocket | null = null;
    
    // Teams state management
    private meetingState: MeetingState | null = null;
    private meetingPermissions: MeetingPermissions | null = null;
    private stateChangeCallbacks: Array<(state: MeetingState, permissions: MeetingPermissions) => void> = [];

    constructor(
        token: string,
        manufacturer: string,
        device: string,
        app: string,
        appVersion: string,
        protocol: string = "2.0.0"
    ) {
        this.websocketUri = `${Teams.baseUrl}?token=${token}&protocol-version=${protocol}&manufacturer=${encodeURIComponent(manufacturer)}&device=${encodeURIComponent(device)}&app=${encodeURIComponent(app)}&app-version=${encodeURIComponent(appVersion)}`;
    }

    /**
     * Initialize the WebSocket connection
     */
    public async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                streamDeck.logger.info(`Connecting to WebSocket at ${this.websocketUri}`);
                this.webSocket = new WebSocket(this.websocketUri);
                
                // Events listeners
                this.webSocket.onopen = () => this.onOpen(resolve);
                this.webSocket.onerror = (error: WebSocket.ErrorEvent) => this.onError(error, reject);
                this.webSocket.onclose = (event: WebSocket.CloseEvent) => this.onClose(event);
                this.webSocket.onmessage = (event: WebSocket.MessageEvent) => this.onMessage(event);

            } catch (error) {
                console.error(`Error connecting to WebSocket: ${error}`);
                reject(error);
            }
        });
    }

    /**
     * Handle WebSocket open event
     */
    private onOpen(resolve: () => void): void {
        streamDeck.logger.info("Connected successfully!");
        streamDeck.logger.info(`Connected to WebSocket at ${this.websocketUri}`);
        streamDeck.logger.info(`WebSocket State: ${this.webSocket?.readyState}`);
        resolve();
    }

    /**
     * Handle WebSocket error event
     */
    private onError(error: WebSocket.ErrorEvent, reject: (reason?: any) => void): void {
        streamDeck.logger.error("WebSocket error:", error.message);
        reject(new Error("WebSocket connection failed"));
    }

    /**
     * Handle WebSocket close event
     */
    private onClose(event: WebSocket.CloseEvent): void {
        console.log("WebSocket connection closed:", event.code, event.reason);
        // Auto-reconnect after 5 seconds if connection was not closed intentionally
        if (event.code !== 1000) {
            setTimeout(() => {
                console.log("Attempting to reconnect...");
                this.connect().catch(console.error);
            }, 5000);
        }
    }

    /**
     * Handle WebSocket message event
     */
    private onMessage(event: WebSocket.MessageEvent): void {
        console.log("Received message:", event.data);
        // Handle incoming messages here
        try {
            const data = JSON.parse(event.data.toString());
            this.handleTeamsMessage(data);
        } catch (error) {
            console.error("Failed to parse Teams message:", error);
        }
    }

    /**
     * Handle parsed Teams messages
     */
    private handleTeamsMessage(data: TeamsMessage): void {
        console.log("Processed Teams message:", data);
        
        // If message contains meeting update, update the state
        if (data.meetingUpdate) {
            this.updateMeetingState(data.meetingUpdate);
        }
    }

    /**
     * Update the meeting state and notify callbacks
     */
    private updateMeetingState(meetingUpdate: MeetingUpdate): void {
        this.meetingState = meetingUpdate.meetingState;
        this.meetingPermissions = meetingUpdate.meetingPermissions;
        
        console.log("Meeting state updated:", this.meetingState);
        console.log("Meeting permissions updated:", this.meetingPermissions);
        
        // Notify all registered callbacks
        this.stateChangeCallbacks.forEach(callback => {
            try {
                callback(this.meetingState!, this.meetingPermissions!);
            } catch (error) {
                console.error("Error in state change callback:", error);
            }
        });
    }

    /**
     * Register a callback for state changes
     */
    public onStateChange(callback: (state: MeetingState, permissions: MeetingPermissions) => void): void {
        this.stateChangeCallbacks.push(callback);
    }

    /**
     * Remove a state change callback
     */
    public removeStateChangeCallback(callback: (state: MeetingState, permissions: MeetingPermissions) => void): void {
        const index = this.stateChangeCallbacks.indexOf(callback);
        if (index > -1) {
            this.stateChangeCallbacks.splice(index, 1);
        }
    }

    /**
     * Get current meeting state
     */
    public getMeetingState(): MeetingState | null {
        return this.meetingState;
    }

    /**
     * Get current meeting permissions
     */
    public getMeetingPermissions(): MeetingPermissions | null {
        return this.meetingPermissions;
    }

    public async disconnect(): Promise<void> {
        return new Promise((resolve) => {
            if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
                this.webSocket.onclose = () => {
                    console.log("Disconnected successfully!");
                    resolve();
                };
                this.webSocket.close(1000, "Closing connection");
            } else {
                console.log("WebSocket is not open, cannot disconnect.");
                resolve();
            }
        });
    }

    public async sendAction(actionName: string, parameters: any): Promise<void> {
        if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }

        const payload = {
            action: actionName,
            parameters: parameters,
            requestId: 1
        };

        const jsonMessage = JSON.stringify(payload);
        this.webSocket.send(jsonMessage);
    }

    /**
     * Get the current WebSocket state
     */
    public getState(): number | null {
        return this.webSocket?.readyState ?? null;
    }

    /**
     * Check if the WebSocket is connected
     */
    public isConnected(): boolean {
        return this.webSocket?.readyState === WebSocket.OPEN;
    }

    // Convenience methods for common Teams actions
    
    /**
     * Leave the current call
     */
    public async leaveCallEvent(): Promise<void> {
        return this.sendAction("leave-call", {});
    }

}