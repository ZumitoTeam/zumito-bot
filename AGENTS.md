# Service import notes
To import a service, you can use the following syntax:
```ts
import { ServiceContainer } from 'zumito-framework';
import { EmbedBuilderService } from './services/EmbedBuilderService.js';

ServiceContainer.getService(EmbedBuilderService)
```

## Incorrect import examples
- Avoid importing services with "as", as it alredy returns the correct type.
```ts
import { EmbedBuilderService } from './services/EmbedBuilderService.js';

// Incorrect
const embedBuilderService = ServiceContainer.getService(EmbedBuilderService) as EmbedBuilderService;

// Correct
const embedBuilderService = ServiceContainer.getService(EmbedBuilderService);
```

- Avoid importing services directly without using the ServiceContainer.
```ts   
// Incorrect
import { EmbedBuilderService } from './services/EmbedBuilderService.js';
const embedBuilderService = new EmbedBuilderService();

// Correct
import { EmbedBuilderService } from './services/EmbedBuilderService.js';
const embedBuilderService = ServiceContainer.getService(EmbedBuilderService);
``` 

- If you're on a class, prefer alwais importing from the constructor where possible.
```ts
import { ServiceContainer } from 'zumito-framework';
import { EmbedBuilderService } from './services/EmbedBuilderService.js';

export class ExampleClass {

    constructor(
        // Correct
        private embedBuilderService = ServiceContainer.getService(EmbedBuilderService),
    ) {
        super();
    }

    exampleMethod() {
        // Incorrect
        const embedBuilderService = ServiceContainer.getService(EmbedBuilderService);
    }
}
```

# Correct usage of discord components
## Embeds
Always you want to create an embed. You must create an embedBuilder service, with a method to build the embed.
```ts
const embedBuilderService = ServiceContainer.getService(EmbedBuilderService);
const embed = embedBuilderService.buildExampleEmbed({
    title: "Example Embed",
    description: "This is an example embed",
    footer: "Footer text"
});
```

## Buttons
Like embeds, for complex buttons, you must create a buttonBuilder service, with a method to build the button.
```ts
const buttonBuilderService = ServiceContainer.getService(ButtonBuilderService);
const button = buttonBuilderService.buildExampleButton();
```

For handling button interactions, you must:
1. Register button handler on the command class.
```ts
export class ExampleCommand extends Command {
    // ...
    binds: CommandBinds = {
        buttonPress: this.buttonPress, 
    };
    // ...
}
```
2. Implement the button handler method.
```ts
async buttonPress({ interaction, path }: ButtonPressedParams): Promise<void> {
    if (path[1] === 'buttonId') {
        // Handle button press
    }
}
```
3. Create the button with the correct customId.
```ts
const button = new ButtonBuilder()
    .setCustomId(`commandName.buttonId`)
    .setLabel('Press me')
    .setStyle(ButtonStyle.Primary);
```

### Notes
- As you can see, button id MUST be, {commandName}.{buttonId}

## Modals
Modals are a bit more complex, as you must create a modalBuilder service, with a method to build the modal.
```ts
const modalBuilderService = ServiceContainer.getService(ModalBuilderService);
const modal = modalBuilderService.buildExampleModal();
```

For handling modal submits, you must:
1. Register modal submit handler on the command class.
```ts
export class ExampleCommand extends Command {
    // ...
    binds: CommandBinds = {
        modalSubmit: this.modalSubmit, 
    };
    // ...
}
```
2. Implement the modal submit handler method.
```ts
async modalSubmit({ interaction, path }: ModalSubmitParameters): Promise<void> {
    if (path[1] === 'modalId') {
        // Handle modal submit
    }
}
```
3. Create the modal with the correct customId.
```ts
const modal = new ModalBuilder()
    .setCustomId(`commandName.modalId`)
    .setTitle('Modal title');
```

### Notes
- As you can see, modal id MUST be, {commandName}.{modalId} 

## Notes
- EmbedBuilder, ButtonBuilder, ModalBuilder, etc. Should't be added as .addService() to the module, as it will be loaded at runtime.

# Aditional notes
- Always prefer import services inline from constructors, as it makes the code more readable.
```ts
export class ExampleClass {

    // Correct
    constructor(
        private auth = ServiceContainer.getService(UserPanelAuthService),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager),
        private userPanelLanguageManager = ServiceContainer.getService(UserPanelLanguageManager),
    ) {
        super();
    }

    // Incorrect
    auth: UserPanelAuthService;
    translationService: TranslationManager;
    userPanelLanguageManager: UserPanelLanguageManager;
    constructor(arg: string) {
        super(arg);
        this.auth = ServiceContainer.getService(UserPanelAuthService);
        this.translationService = ServiceContainer.getService(TranslationManager);
        this.userPanelLanguageManager = ServiceContainer.getService(UserPanelLanguageManager);
    }
}
```

