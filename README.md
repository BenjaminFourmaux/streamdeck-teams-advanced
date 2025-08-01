# Teams Advanced
[![](https://shields.io/badge/Elgato-Stream%20Deck-darkblue?logo=elgato&style=flat&logoColor=white)]() [![](https://shields.io/badge/Microsoft-Teams-464EB8?logo=microsoftteams&style=flat&logoColor=white)]() [![](https://img.shields.io/badge/9.0-dotnet?style=flat&logo=dotnet&label=C%23&color=purple)]()

Unofficial Microsoft Teams Stream Deck plugin with advanced functions 

This plugin is for testing the retro-engineering of [Microsoft Teams plugin](https://marketplace.elgato.com/product/microsoft-teams-da5e2bbc-197c-4afe-8a85-a9941bf52697) by trying to implement advanced actions and see what Teams is capable of doing via its websocket.
Moreover, building a Stream Deck plugin in ~~C#~~ JavaScript, awaiting to an official SDK for C# .Net (I hope)

## Prerequisites

Following the [Stream Deck SDK doc](https://docs.elgato.com/streamdeck/sdk/introduction/getting-started/), you need the following requis:
-  Node.js >= 20
- Stream Deck software >= 6.4
- Stream Deck device
- [Elgato CLI](https://docs.elgato.com/streamdeck/sdk/introduction/getting-started/#setup-wizard)
- Microsoft Teams desktop
    - Third-Part API enabled (_Settings/Privacy/Manage API/Enable API_)

## Installation

### Install deps
```shell
npm install
```

### Build the plugin
```shell
npm run build
```

> refer to the commande `build` findable in `package.json`

That create a specific folder `com.tech-ben.teams-advanced.sdPlugin` that contains compiled plugin source

### Link the plugin to the Stream Deck Software
```shell
streamdeck link com.tech-ben.teams-advanced.sdPlugin
```

## Actions