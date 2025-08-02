import streamDeck, { LogLevel } from "@elgato/streamdeck";
import { teamsService } from "./services/teams-service";   
import { EndCall } from "./actions/end-call";

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
//streamDeck.logger.setLevel(LogLevel.TRACE);

// Initialize Teams connection
async function initializeTeams() {
    try {
        // Replace these parameters with actual values from your Teams app registration
        await teamsService.initialize(
            "", // token - Must be empty for Teams New (maybe for simplified device pairing)
            "Elgato", // manufacturer
            "Stream Deck", // device
            "Teams Advanced Plugin", // app
            "1.0.0" // appVersion
        );
        
        streamDeck.logger.info("Successfully connected to Teams WebSocket API");
    } catch (error) {
        streamDeck.logger.error("Failed to connect to Teams WebSocket API:", error);
        // Don't throw here - allow the plugin to continue without Teams connection
    }
}

// Register actions
streamDeck.actions.registerAction(new EndCall());

// Initialize Teams connection and then connect to Stream Deck
initializeTeams().then(() => {
    // Finally, connect to the Stream Deck.
    streamDeck.connect();
});
