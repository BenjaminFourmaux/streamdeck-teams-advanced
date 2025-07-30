using System.Text.Json.Serialization;

namespace Teams.Entity
{
    public static class TeamsActions
    {
        public static class CallControls
        {
            public const string ToggleMute = "toggle-mute";
            public const string ToggleVideo = "toggle-video";
            public const string HandRaise = "toggle-hand";
            public const string LeaveCall = "leave-call";
        }

        public static class VisualEffects
        {
            public const string ToggleBackgroundBlur = "toggle-background-blur";
        }

        public static class Reactions
        {
            public const string Send = "send-reaction";

            [JsonConverter(typeof(JsonStringEnumConverter))]
            public enum ReactionType
            {
                [JsonPropertyName("applause")]
                Applause,

                [JsonPropertyName("laugh")]
                Laugh,

                [JsonPropertyName("like")]
                Like,

                [JsonPropertyName("love")]
                Love,

                [JsonPropertyName("wow")]
                Wow,
            }
        }

        public static class UI
        {
            public const string ToggleUI = "toggle-ui";

            [JsonConverter(typeof(JsonStringEnumConverter))]
            public enum UIType
            {
                [JsonPropertyName("chat")]
                Chat,

                [JsonPropertyName("share-tray")]
                ShareTray,
            }
        }

        public static class System
        {
            public const string QueryState = "query-state";
        }
    }
}
