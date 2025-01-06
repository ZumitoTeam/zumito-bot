---
name: "[DEV] Create embed"
about: Issue for creating new embed
title: ''
labels: embed
assignees: ''

---

<!-- Embed description -->

<!-- Embed image -->
Instructions:

1. Create a file on /src/modules/<ModuleName>/embeds/<EmbedName>EmbedBuilder.ts with a function that exports an embed builder like this:
```js
import { EmbedBuilder } from 'zumito-framework/discord';
import { TranslationManager } from "zumito-framework";

export class <EmbedName>EmbedBuilder {
    
    translator: TranslationManager;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    getEmbed({question, answer, locale}: any) {
        const exampleEmbed = new EmbedBuilder()
	    .setColor(0x0099FF)
	    .setTitle('Some title')
	    .setDescription(this.translator.get('examplePhrase1', locale));
	
	return exampleEmbed;
    }
}
```
