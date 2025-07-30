namespace Teams.Entity
{
    public class StateEvent
    {
        public MeetingUpdate MeetingUpdate { get; set; }
    }

    public class MeetingUpdate
    {
        public MeetingSate MeetingSate { get; set; }
        public MeetingPermissions MeetingPermissions { get; set; }
    }

    public class MeetingSate
    {
        /// <summary>
        /// If the user is muted in the meeting.
        /// </summary>
        public bool IsMuted { get; set; }

        /// <summary>
        /// If the meeting is currently recording.
        /// </summary>
        public bool IsRecordingOn { get; set; }

        /// <summary>
        /// If the user has their camera turned on.
        /// </summary>
        public bool IsVideoOn { get; set; }

        /// <summary>
        /// If the user has unread messages in the meeting.
        /// </summary>
        public bool HasUnreadMessages { get; set; }

        /// <summary>
        /// If the user has raised their hand in the meeting.
        /// </summary>
        public bool IsHandRaised { get; set; }

        /// <summary>
        /// If the user is currently sharing their screen.
        /// </summary>
        public bool IsSharing { get; set; }

        /// <summary>
        /// If the user is currently in a meeting.
        /// </summary>
        public bool IsInMeeting { get; set; }

        /// <summary>
        /// if the user has a background blur effect applied.
        /// </summary>
        public bool IsBackgroundBlurred { get; set; }
    }

    public class MeetingPermissions
    {
        /// <summary>
        /// If the user can perform reactions in the meeting.
        /// </summary>
        public bool CanReact { get; set; }

        /// <summary>
        /// If the user can activate the camera in the meeting.
        /// </summary>
        public bool CanToggleVideo { get; set; }

        /// <summary>
        /// If the user can activate the microphone in the meeting.
        /// </summary>
        public bool CanToggleMute { get; set; }

        /// <summary>
        /// If the user can raise their hand in the meeting.
        /// </summary>
        public bool CanToggleHand { get; set; }

        /// <summary>
        /// If the user can share their screen in the meeting.
        /// </summary>
        public bool CanToggleShareTray { get; set; }

        /// <summary>
        /// If the user can leave the meeting or stay for all his live.
        /// </summary>
        public bool CanLeave { get; set; }

        /// <summary>
        /// If the user can toggle blur effect in his camera background in the meeting.
        /// </summary>
        public bool CanToggleBlur { get; set; }

        /// <summary>
        /// If the user can toggle the chat in the meeting.
        /// </summary>
        public bool CanToggleChat { get; set; }

        /// <summary>
        /// If the user can stop sharing their screen in the meeting.
        /// </summary>
        public bool CanStopSharing { get; set; }

        /// <summary>
        /// If the user can pair their device in the meeting.
        /// </summary>
        public bool CanPair { get; set; }
    }
}
