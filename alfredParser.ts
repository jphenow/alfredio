#!/usr/bin/env deno

export interface AlfredIcon {
    type: "fileicon" | "filetype";
    path: string; // ~/Desktop | path.to.png
}

export interface AlfredItemMod {
    valid?: boolean;
    arg?: string;
    subtitle: string;
    icon?: AlfredIcon
}

export interface AlfredItemMods {
    alt?: AlfredItemMod;
    cmd?: AlfredItemMod;
}

export interface AlfredItemText {
    copy?: string;
    largetype?: string;
}

export interface AlfredItem {
    uid?: string;
    type: "default" | "file" | "file:skipcheck";
    title: string;
    subtitle?: string;
    arg?: string;
    autocomplete?: string;
    match?: string;
    valid?: boolean;
    mods?: AlfredItemMods;
    icon?: AlfredIcon;
    text?: AlfredItemText;
    quicklookurl?: string;
}

export interface AlfredItemSet {
    items: AlfredItem[]
    variables?: { [key: string]: string };
}

export interface ItemNeeds {
    action: string[];
    matcher: (query: string[]) => boolean;
}

export class ItemHandler {
    constructor(private params: ItemNeeds & AlfredItem) { }

    public generateItem(): AlfredItem {
        const {
            uid,
            type,
            title,
            subtitle,
            arg,
            autocomplete,
            match,
            valid,
            mods,
            icon,
            text,
            quicklookurl } = this.params;

        return { uid, type, title, subtitle, arg, autocomplete, match, valid, mods, icon, text, quicklookurl };
    }

    public matcher(query: string[]) {
        return this.params.matcher(query);
    }

    public get action() {
        return this.params.action;
    }
}

export class Parser {
    constructor(private items: ItemHandler[], private input: string[]) { }

    public static process(items: ItemHandler[], args: string[]): number {
        const subcommand = args[0];
        const query = args.slice(1);

        switch (subcommand.toLowerCase()) {
            case "query":
                console.log(JSON.stringify(new Parser(items, query).query()));
                return 0;
            case "execute":
                new Parser(items, query).execute();
                return 0;
            default:
                console.log(`No matching subcommand: ${subcommand}`);
                return -1;
        }
    }

    public query(): AlfredItemSet {
        const query = this.cleanInput();

        let results: AlfredItem[] = [];
        for (const item of this.items) {
            if (item.matcher(query)) {
                results = results.concat(item.generateItem());
            }
        }

        return { items: results }
    }

    public execute(): void {
        const query = this.cleanInput();

        for (const item of this.items) {
            if (item.matcher(query)) {
                Deno.run({ args: item.action });
                break;
            }
        }
    }

    private cleanInput(): string[] {
        if (this.input.length === 1) {
            if (this.input[0] === '(null)') {
                return [''];
            }
        }

        return this.input;
    }
}
