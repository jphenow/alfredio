# Alfred IO

I wrote this using [Deno](https://deno.land) to experiment with Deno and improve a
workflow I wrote for myself for [Alfred](https://www.alfredapp.com/).

The basic idea:

* In code configure your various sub-tasks
* In Alfred, point to your script for querying _and_ for executing
* Use Alfred

## Usage

This isn't currently in any kind of package management because it felt overkill for
what I needed at this point. So steps to running are like so:

* Install [Alfred](https://www.alfredapp.com/)
* Install [Deno](https://deno.land)
* Pull this code
* Author your Alfred items in code
* Point Alfred workflow at your code
* Execute your query

![](https://cl.ly/299b9469ca45/Screen%252520Recording%2525202019-07-12%252520at%25252009.45%252520AM.gif)

### Authoring Alfred Items

I recommend having a `bin` dir in your Home directory. In there you might add something like this:

```typescript
import { Parser } from "../Code/alfredio/alfredio.ts";

const items = [new ItemHandler({
    uid: "jonphenow.alfred.gh",
    type: "default",
    title: "Open My GitHub",
    autocomplete: "github",
    arg: "github",

    action: ["open", "https://github.com/jphenow"],
    matcher: (query) => {
        if (query.length === 0) { return true; }

        const [subcommand] = query;
        return "github".startsWith(subcommand);
    }
});];

Parser.process(items, Deno.args.slice(1))
```

For more information on the format of the AlfredItems see the interface and [the Alfred Docs](https://www.alfredapp.com/help/workflows/inputs/script-filter/json/)

### Point Alfred workflow at your code

* In Alfred Preferences, create a new workflow
* Right-click on the workflow area and select Inputs > Script Filter
    - Set a keyword like `jp`
    - :white_check_mark: With space
    - Argument Optional

Now for the most important part. In the script area:

```bash
/usr/local/bin/deno --allow-all "path/to/your/alfred/config/from/above.ts" query $@
```

Save the Script filter then grab the little nub sticking out and drag it.

* Select Actions > Run Script
* /bin/bash
* with input as arv

Then in the script:

```bash
/usr/local/bin/deno --allow-all "path/to/your/alfred/config/from/above.ts" execute $@
```

### Execute your query

At this point you should be able to open Alfred and use your Alfred items.

If you have issues, from the Alfred Workflow, select the bug in the top-right to see any log
or error output.
