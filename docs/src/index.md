
# Expression in text

---
You can bind JavaScript expression in html-text, you can use 3 types of quotes: ` '', "", `` `.

```html
<div>
    {name}
    {getValue('title')}
    {a} + {b} = {a + b}
    {'text with "quotes"' + `123`}
    {`js template ${variable}`}
</div>
```


# Bindings

## Reference

---
You can get reference to element/component using `#ref` and save it to a variable.

```html
<script>
    let ref;
    let component;
</script>

<input #ref />
<Component #component />
```


## 1-way binding

---
For binding to attributes and properties you can write `attribute={value}`, if attribute and variable names the same you can use shortcut `{attribute}`, for binding you can use JavaScript expression.

```html
<input value="{value}" />
<input value={value} />
<input {value} />
<button disabled={!clickable}>Click</button>
```


---
Also you can *spread* an object to attributes.

```html
<script>
    let props = {
        value: 'Hello',
        title: 'Some title'
    };
</script>

<input {...props} />
```


## 2-way binding

---
For 2-way binding you can use `bind:value={value}` or shortcut `:value={value}`, when property name the same as variable name you can omit it, e.g. `:value`

```html
<script>
    let name = '';
    let checked = false;
</script>
<input type="text" :value={name} />
<input type="checkbox" :checked />
```


## Class and Style

---
To set class and style you can use `class:className={condition}`, `style:styleName={value}`.

```html
<div class:blue={value} class:red={!value}>by class name</div>
<div class="{value?'red':'blue'}">attribute class</div>
<b style="color: {value?'green':'red'};">style as string</b>
<b style:color={value}>Style as prop</b>

<style>
    .blue {};
    .red {};
</style>
```


## Actions

---
You can run some JavaScript code on element, `use:action={param}` or shortcut `*action={param}`, without arguments it looks like `*action`.

Also you can run some JavaScript code where `$element` is available - `*{$element.focus()}`.

```html
<script>
    function draw(element) {
        ...
    }
</script>
<div *draw></div>
<input *{$element.focus()} />
```


---
If you need more control you can pass arguments and subscribe for updates and destroy event.

```html
<script>
    function draw(element, a, b) {
        ...
        return {
            update: (a, b) => {},
            destroy: () => {}
        }
    }
</script>
<div *draw={a, b}></div>
```


## Events

---
To listen events you can use `on:eventName={expression}` or shortcut `@eventName={expression}`.

For expression you can use function name `@click={handler}` or `@click:handler`, function declaration `@click={(e) => handler(e)}` or js-expression `@click={handler($event)}`.

```html
<script>
    const handler = (event) => {};
</script>
<button @click:handler>Click</button>
<button @click={handler}>Click</button>
<button @click={(e) => handler(e)}>Click</button>
<button @click={handler($event, $element)}>Click</button>
```


---
Also you can use modificators for elements: `enter`, `escape`, `preventDefault`.

```html
<input type="text" @keyup|enter:handler />
```


---
Also you can forward events to a parent component, `@eventName` to forward one type of event, `@@` to forward all events from current element, the same works for components.

```html
<button @click>Click</button>
<input type="text" @@ />
<Component @click />
```



# Control blocks

## #if-else

---
Block of template can be rendered by condition.

```html
{#if condition}
    One content
{:else}
    Another content
{/if}
```


## #each

---
Iterating over list.

```html
<ul>
    {#each items as item}
        <li>{item.name}</li>
    {/each}
</ul>
```


Possible options:

```html
{#each items as item}...{/each}
```

```html
{#each items as item, index}...{/each}
```

```html
{#each items as {id, name, key1, key2} }...{/each}
```

```html
{#each items as item, index (item.id)}...{/each}
```

```html
{#each items as item, index (index)}...{/each}
```

```html
{#each number as value}...{/each}
```


## #fragment


You can declare some fragment to reuse it a few times other places. Also it can be declared anywhere, e.g. inside of the `#each`, so it will have all scoped variables.

```html
<div>
    {#fragment:button text}
        <div class="col-sm-6 smallpad">
            <button @click type="button" class="btn">{text}</button>
        </div>
    {/fragment}

    <fragment:button text='Left' @click:left />
    <fragment:button text='Right' @click:right />
</div>
```

<br/>
Also you can call it recursively.

```html
<script>
    let tree = [{
        name: 'OS',
        children: [{
            name: 'Linux',
            children: [{name: 'Ubuntu'}, {name: 'Debian'}, {name: 'RedHat'}]
        }, {
            name: 'MacOS X'
        }]
    }];

    const click = (name) => {console.log(name)};
</script>

<fragment:draw list={tree}>

{#fragment:draw list}
    <ul>
        {#each list as it}
        <li @click|stopPropagation={click(it.name)}>
            {it.name}
            {#if it.children}
                <fragment:draw list={it.children} />
            {/if}
        </li>
        {/each}
    </ul>
{/fragment}
```


## #await

---
You can await a promise to display placeholder etc.

```html
<div>
{#await promise}
    Loading...
{:then value}
    Data: {value}
{:catch error}
    Loading error: {error}
{/await}
</div>
```

Possible options:

```html
{#await expression}...{:then name}...{:catch name}...{/await}
```

```html
{#await expression}...{:then name}...{/await}
```

```html
{#await expression then name}...{/await}
```



## @html

---
To render some HTML, you can use `{@html expression}`.

```html
<div>
    {@html post.content}
</div>
```



# Components

## Structure

---
A component can have script block, style block and rest content becomes a template

```html
<script>
    ...
</script>

... content ...

<style>
    ...
</style>
```


---
You can import a component `import Component from './Component.html'`, and use it in template as `<Component />`, a component should start with capital letter.

```html
<script>
    import Component from './Component.html';
</script>

<Component />
```


## Properties and attributes

---
You can pass some arguments into a component, it's a 1-way binding.

Also you can spread an object to pass all values as arguments.

```html
<Component value={expression} {name} {...obj} />
```



---
You can use keyword `export` to mark a variable as property, so it will receive a value from parent component and will be updated on changes.

A parent can pass more arguments than number of props in a component, so all arguments will be available in `$props`, and all arguments which are not property are in `$attributes`.

```html
<script>
    export let name = 'default';

    $props
    $attributes
</script>

<input {...$props} />
<input {...$attributes} />
```


## 2-way binding

---
Syntax for 2-way binding is the same as for elements.

```html
<Component :value={variable} />
```


## Events

---
It's possible to listen an event, forward an event and forward all events. Syntax for events is the same as for elements.

```html
<Component @click:handler />
```


---
Also you can emit an custom event, for this you can use a built function `$emit(eventName, details)`.

```html
<script>
    $emit('myevent', 'info');
</script>
```



## Slots

---
You can pass slots to a child component. To pass a default slot:

```html
<Child>
  Some content
</Child>

<!-- Child.html -->
<slot>No content</slot>
```


---
To pass named slots:

```html
<Child>
    {#slot:title}
        Some title
    {/slot}

    Some content

    {#slot:footer}
        Some footer
    {/slot}
</Child>

<!-- Child.html -->

<slot />
<slot>No content</slot>
<slot:title>No title</slot>
<slot:footer>No title</slot> or <slot:footer>No title</slot:footer>
```


---
A child component can pass a property to parent slot:

```html
<Child>
    {#slot prop}
        Some content {prop.value} {parentVar}
    {/slot}
</Child>

<!-- Child.html -->

{#each items as item}
    <slot prop={item}>No content {childVar}</slot>
{/each}
```


## Dynamic component

---
Dynamic component let you to attach a component from variable/expression.

```html
<script>
    import Music from './Music.xht';
    import Movie from './Movie.xht';
    
    let comp, x;

    function toggle() {
        comp = comp == Music ? Movie : Music;
        x ^= 1;
    }
</script>

<component:comp />
<component:{x ? Music : Movie} />

<button @click:toggle>Switch</button>
```


## Passing CSS class

You can pass classes into child components and use them with property `$class` or attach them, [read an article](https://medium.com/@lega911/how-a-popular-feature-declined-by-svelte-went-live-in-malina-js-1a08fdb9dbc4)

---
**Property $class**: If you pass classes into a component using attribute `class`, then a child component will have these classes with hash in attribute `$class`


```html
<!-- App -->
<Child class="red italic" />

<!-- Child -->
<div class={$class}>
    Child
</div>
```

---
**Named $class**: If you need to pass more than one class property, you can use attribute of `$class`, like `$class.header`


```html
<!-- App -->
<Child .header="red bold" .body:italic={cond} />

<!-- Child -->
<div class={$class.header}>
    Header
</div>

<div class={$class.body}>
    Body
</div>
```


---
**Adopt a class**: You can adopt a class using syntax `:export(.class-name) {...default style...}`


```html
<!-- App -->
<Child class="btn" />

<style>
    .btn {color: red}
</style>

<!-- Child -->
<button class="btn">button</button>

<style>
    .btn {font-style: italic}
    :export(.btn) {color: blue}
</style>
```

---
Also you can rename passed class, and use class directives


```html
<Child class:btn={cond} />
<Child .btn="red bold" />
<Child .btn:purple={cond} />
```



## Other

---
If you have an instance of component, you can read/write properties directly.

```html
<script>
    import Component from './Component.html';
    let comp;

    function increment() {
        comp.value++;
    }
</script>
<Component #comp />
```


---
If you need to perform some code after mounting or during destroying a component, you can use declare functions `onMount`, `onDestroy`, or use a built function `$onDestroy(fn)`.

```html
<script>

    called_at_start();

    function onMount() {
        // called after mounting

        $onDestroy(() => {...});  // subscribe on destroying
        $onDestroy(() => {...});
    }

    function onDestroy() {
        // called during destroying
    }
</script>
<Component #comp />
```



# Other

## Scoped CSS

---
Malina.js makes all styles are scoped for a component, it appends a prefix class to styles and elements from template based on selector, so only required elements are marked.

Using keyword `:global()` you make certain style as global.

```html
<style>
    span {
        /* all <span> elements, only from
        current component will be affected */
    }
    :global(body) {
        /* effects on <body> */
    }
    div :global(span) {
        /* effects on all <span> elements
        (including child components)
        inside of <div> from current component */
    }
</style>
```


## Watch expression, reactivity

---
Using syntax `$:` you can observe changes.

Computed value: `$: value = a + b`, `value` will be changed when an expression gives another result.

Observe changes in expression; `$: name, () => console.log(name);`, a function will be called when `name` is changde.

Also you can observe a few expressions: `$: exp1, exp2, exp3, (value1, value2, value3) => {...};`.


```html
<script>
    let name = '';
    $: header = name.toUpperCase();
    $: name, () => console.log(name);
</script>

<input type="text" :value={name} />
```


## Compile options

* warning - <function> to receive warnings
* inlineTemplate - <true/false> convert new line to \n
* hideLabel - <true/false> hide comment tags (labels) from DOM
* compact - <true/false> remove spaces between DOM elements
* autoSubscribe - <true/false> autosubscribe imported stores
* cssGenId - <function> generate hash for css classes
