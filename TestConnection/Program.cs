using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

Console.WriteLine("WebSocket Client - Connecting to localhost:8124");

using var webSocket = new ClientWebSocket();

async Task SendActions(string actionName, dynamic parameters)
{
    var payload = new
    {
        action = actionName,
        parameters = parameters,
        requestId = 1
    };

    var jsonMessage = JsonSerializer.Serialize(payload);
    var jsonBytes = Encoding.UTF8.GetBytes(jsonMessage);

    await webSocket.SendAsync(new ArraySegment<byte>(jsonBytes), WebSocketMessageType.Text, true, CancellationToken.None);
    Console.WriteLine($"[SEND] {jsonMessage}");
}

try
{
    var TOKEN = string.Empty;

    var uri = new Uri($"ws://127.0.0.1:8124?token={TOKEN}&protocol-version=2.0.0&manufacturer=Tech%20Ben&device=Dotnet&app=TestConnection&app-version=2.0.26");
    Console.WriteLine($"Connecting to {uri}...");
    
    await webSocket.ConnectAsync(uri, CancellationToken.None);
    Console.WriteLine("Connected successfully!");
    Console.WriteLine($"WebSocket State: {webSocket.State}");
    Console.WriteLine();
    Console.WriteLine("Type your command:");

    // Task for listening incoming messages
    var receiveTask = Task.Run(async () =>
    {
        var buffer = new byte[4096];
        try
        {
            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                
                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var receivedMessage = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    Console.WriteLine($"[RECEIVED] {receivedMessage}");
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine("[INFO] Server close the connection");
                    break;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERREUR] Received: {ex.Message}");
        }
    });

    // Boucle pour traiter les commandes utilisateur
    while (webSocket.State == WebSocketState.Open)
    {
        var input = Console.ReadLine();
        
        if (string.IsNullOrWhiteSpace(input))
            continue;


        switch (input.ToLower())
        {
            case "exit":
                Console.WriteLine("Closing connection ...");
                break;
            case "toggle-mute":
                await SendActions("toggle-mute", new { });
                continue;
            case "state":
                await SendActions("query-state", new { });
                continue;
            case "toggle-chat":
                await SendActions("toggle-ui", new { type = "chat" });
                continue;
            case "start-sharing":
                await SendActions("toggle-ui", new { type = "share-tray" });
                continue;
            case "stop-sharing":
                await SendActions("stop-sharing", new { });
                continue;
        }
    }

    // Fermer la connexion proprement
    if (webSocket.State == WebSocketState.Open)
    {
        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing", CancellationToken.None);
        Console.WriteLine("Connection closed gracefully");
    }

    // Attendre que la tâche de réception se termine
    await receiveTask;
}
catch (WebSocketException wsEx)
{
    Console.WriteLine($"WebSocket Error: {wsEx.Message}");
    Console.WriteLine($"Error code: {wsEx.WebSocketErrorCode}");
}
catch (Exception ex)
{
    Console.WriteLine($"Error: {ex.Message}");
}

Console.WriteLine("Press any key to leave ...");
Console.ReadKey();