// Types for Teams state
export interface MeetingState {
    isMuted: boolean;
    isRecordingOn: boolean;
    isVideoOn: boolean;
    hasUnreadMessages: boolean;
    isHandRaised: boolean;
    isSharing: boolean;
    isInMeeting: boolean;
    isBackgroundBlurred: boolean;
}

export interface MeetingPermissions {
    canReact: boolean;
    canToggleVideo: boolean;
    canToggleMute: boolean;
    canToggleHand: boolean;
    canToggleShareTray: boolean;
    canLeave: boolean;
    canToggleBlur: boolean;
    canToggleChat: boolean;
    canStopSharing: boolean;
    canPair: boolean;
}

export interface MeetingUpdate {
    meetingState: MeetingState;
    meetingPermissions: MeetingPermissions;
}

export interface TeamsMessage {
    meetingUpdate?: MeetingUpdate;
    requestId?: string;
    response?: string;
}

export interface ActionPayload {
    action: string;
    parameters: any;
    requestId: string;
}