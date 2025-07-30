using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

namespace Teams
{
    /// <summary>
    /// Teams Internal Local API, manage websocket connections and actions.
    /// </summary>
    public class TeamsILAPI
    {
        public const string baseUrl = "ws://127.0.0.1:8124";
        public Uri WebsocketUri { get; private set; }
        private ClientWebSocket WebSocket = new ClientWebSocket();

        public TeamsILAPI(string token, string manufacturer, string device, string app, string appVersion, string protocol = "2.0")
        {
            WebsocketUri = new Uri($"{baseUrl}?token={token}&protocol-version={protocol}&manufacturer={Uri.EscapeDataString(manufacturer)}&device={Uri.EscapeDataString(device)}&app={Uri.EscapeDataString(app)}&app-version={Uri.EscapeDataString(appVersion)}");
        }

        /// <summary>
        /// Initialize the WebSocket connection
        /// </summary>
        /// <returns></returns>
        public async Task Connect()
        {
            try
            {
                await this.WebSocket.ConnectAsync(WebsocketUri, CancellationToken.None);

                Console.WriteLine("Connected successfully!");
                Console.WriteLine($"Connected to WebSocket at {WebsocketUri}");
                Console.WriteLine($"WebSocket State: {this.WebSocket.State}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error connecting to WebSocket: {ex.Message}");
                throw;
            }
        }

        public async Task Disconnect()
        {
            if (this.WebSocket.State == WebSocketState.Open)
            {
                await this.WebSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing connection", CancellationToken.None);
                Console.WriteLine("Disconnected successfully!");
            }
            else
            {
                Console.WriteLine("WebSocket is not open, cannot disconnect.");
            }
        }

        public async Task SendAction(string actionName, dynamic parameters)
        {
            var payload = new
            {
                action = actionName,
                parameters = parameters,
                requetId = 1
            };

            var jsonMessage = JsonSerializer.Serialize(payload);
            var jsonBytes = Encoding.UTF8.GetBytes(jsonMessage);

            await this.WebSocket.SendAsync(new ArraySegment<byte>(jsonBytes), WebSocketMessageType.Text, true, CancellationToken.None);
        }

    }
}
