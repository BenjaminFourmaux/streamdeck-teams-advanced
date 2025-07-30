using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

Console.WriteLine("WebSocket Client - Connecting to localhost:8124");

using var webSocket = new ClientWebSocket();

try
{
    var TOKEN = string.Empty;

    var uri = new Uri($"ws://127.0.0.1:8124?token={TOKEN}&protocol-version=2.0.0&manufacturer=Tech%20Ben&device=Dotnet&app=TestConnection&app-version=2.0.26");
    Console.WriteLine($"Connecting to {uri}...");
    
    await webSocket.ConnectAsync(uri, CancellationToken.None);
    Console.WriteLine("Connected successfully!");
    Console.WriteLine($"WebSocket State: {webSocket.State}");
    
    // Envoyer le message initial
    var message = "Hello from WebSocket client!";
    var messageBytes = Encoding.UTF8.GetBytes(message);
    await webSocket.SendAsync(new ArraySegment<byte>(messageBytes), WebSocketMessageType.Text, true, CancellationToken.None);
    Console.WriteLine($"Sent: {message}");
    
    Console.WriteLine("\nCommandes disponibles:");
    Console.WriteLine("- toggle-mute : Basculer le micro");
    Console.WriteLine("- exit : Quitter l'application");
    Console.WriteLine("Tapez votre commande:");

    // Tâche pour écouter les messages entrants
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
                    Console.WriteLine($"[REÇU] {receivedMessage}");
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    Console.WriteLine("[INFO] Serveur a fermé la connexion");
                    break;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERREUR] Réception: {ex.Message}");
        }
    });

    // Boucle pour traiter les commandes utilisateur
    while (webSocket.State == WebSocketState.Open)
    {
        var input = Console.ReadLine();
        
        if (string.IsNullOrWhiteSpace(input))
            continue;

        if (input.ToLower() == "exit")
        {
            Console.WriteLine("Fermeture de la connexion...");
            break;
        }

        if (input.ToLower() == "toggle-mute")
        {
            // Créer l'événement toggle-mute au format JSON exact
            var toggleMuteEvent = new
            {
                action = "toggle-mute",
                parameters = new { },
                requestId = 1
            };

            var jsonMessage = JsonSerializer.Serialize(toggleMuteEvent);
            var jsonBytes = Encoding.UTF8.GetBytes(jsonMessage);
            
            await webSocket.SendAsync(new ArraySegment<byte>(jsonBytes), WebSocketMessageType.Text, true, CancellationToken.None);
            Console.WriteLine($"[ENVOYÉ] {jsonMessage}");
        }
        else
        {
            // Envoyer le message tel quel
            var inputBytes = Encoding.UTF8.GetBytes(input);
            await webSocket.SendAsync(new ArraySegment<byte>(inputBytes), WebSocketMessageType.Text, true, CancellationToken.None);
            Console.WriteLine($"[ENVOYÉ] {input}");
        }
    }

    // Fermer la connexion proprement
    if (webSocket.State == WebSocketState.Open)
    {
        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client closing", CancellationToken.None);
        Console.WriteLine("Connexion fermée proprement");
    }

    // Attendre que la tâche de réception se termine
    await receiveTask;
}
catch (WebSocketException wsEx)
{
    Console.WriteLine($"Erreur WebSocket: {wsEx.Message}");
    Console.WriteLine($"Code d'erreur: {wsEx.WebSocketErrorCode}");
}
catch (Exception ex)
{
    Console.WriteLine($"Erreur: {ex.Message}");
}

Console.WriteLine("Appuyez sur une touche pour quitter...");
Console.ReadKey();