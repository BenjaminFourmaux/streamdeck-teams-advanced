using BarRaider.SdTools;

namespace Plugin
{
    [PluginActionId("tv.tech-ben.advanced-teams.end-call")]
    public class CallEnd : KeypadBase
    {
        public CallEnd(SDConnection connection, InitialPayload payload) : base(connection, payload) { }

        public override void Dispose()
        {
            Logger.Instance.LogMessage(TracingLevel.INFO, $"Destructor called");
        }

        public override void KeyPressed(KeyPayload payload)
        {
            Logger.Instance.LogMessage(TracingLevel.INFO, "Key Pressed");
        }

        public override void KeyReleased(KeyPayload payload) { }

        public override void OnTick() { }

        public override void ReceivedSettings(ReceivedSettingsPayload payload) { }

        public override void ReceivedGlobalSettings(ReceivedGlobalSettingsPayload payload) { }
    }
}