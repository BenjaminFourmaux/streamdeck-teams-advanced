import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "com.tech-ben.teams-advanced.end-call" })
export class EndCall extends SingletonAction {

    override onWillAppear(ev: WillAppearEvent): void | Promise<void> {
        
    }

    override async onKeyDown(ev: KeyDownEvent): Promise<void> {
        
    }
}
