import streamDeck, { LogLevel } from "@elgato/streamdeck";
import { EndCall } from "./actions/end-call";


// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
//streamDeck.logger.setLevel(LogLevel.TRACE);

// Register actions
streamDeck.actions.registerAction(new EndCall());

// Finally, connect to the Stream Deck.
streamDeck.connect();
