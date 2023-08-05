
# Expression in text

---
You can bind JavaScript expression in html-template.

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
You can get reference to element/component using `#ref` and save it to a variable. Variable is set to null on destroying.

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
<div style:color={color}
  style:border-color="red"
  style:border="1px solid {color}">
    Style as prop/template
</div>

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

---
You can return destroy function.

```html
<script>
  function draw(element) {
    ...
    return () => { ... code for destroying ... };
  }
</script>
```


## Insert JS

---
You can insert casual JS in template, a current DOM-node is available as `$element`.
<a href="https://malinajs.github.io/repl/#/gist/d6f930f4b47e7fed5335be83d692a423?version=0.6.36" target="_blank">example</a>

```html
{* const name = 'random code' }
<div {* $element.style.color = 'red' }>
  {name}
</div>
```


## Events

---
To listen events you can use `on:eventName={expression}` or shortcut `@eventName={expression}`.

For expression you can use function name `@click={handler}` or `@click:handler`, function declaration `@click={(e) => handler(e)}` or js-expression `@click={handler($event)}`.

```html
<script>
  const click = (event) => {};
</script>
<button @click>Click</button>
<button @click:click>Click</button>
<button @click={click}>Click</button>
<button @click={(e) => click(e)}>Click</button>
<button @click={click($event, $element)}>Click</button>
```

---
Also you can use modificators for elements: `preventDefault` or `prevent`, `stopPropagation` or `stop`
for keyboard events: `enter`, `tab`, `esc`, `space`, `up`, `down`, `left`, `right`, `delete`,
meta keys: `ctrl`, `alt`, `shift`, `meta`


```html
<input type="text" @keyup|enter:handler />
```


---
Also you can forward events to a parent component, `@@eventName` to forward one type of event, `@@` to forward all events from current element, the same works for components.

```html
<button @@click>Click</button>
<input type="text" @@ />
<Component @@click />
```


---
You can use manual event delegation, modifier `root`.

```html
<div @click|root={click}></div>
```


# Control blocks

## #if-else

---
Block of template can be rendered by condition. There is shortcut `{:elif cond}` for `{:else if cond}`.

```html
{#if condition}
  One content
{:else if anotherCondition}
  One more
{:else}
  Another content
{/if}
```


## #each

---
Iterating over list, you can pass a key which lets to associate item with DOM element, by default key is chosen depends on content.
<a target="_blank" href="https://malinajs.github.io/repl/#/share/TSK8J7eijHo?version=0.6.36">example</a> shows difference depends of used key.

```html
<ul>
  {#each items as item}
    <li>{item.name}</li>
  {/each}
</ul>
```

---
You can add section `{:else}` to display block when list is empty.

```html
{#each items as item}
  <div>{item.name}</div>
{:else}
  No items
{/each}
```


Examples:

```html
{#each items as item}...{/each}
```

```html
{#each items as item, index}...{/each}
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

```html
Destructuring:

{#each items as {id, name, key1, key2} }...{/each}

{#each items as [a, b]}...{/each}
```


## #fragment


---
You can declare some fragment to reuse it a few times other places. Also it can be declared anywhere, e.g. inside of the `#each`, so it will have all scoped variables.
<a target="_blank" href="https://malinajs.github.io/repl/#/share/QzoQntzlIxI?version=0.6.36">example</a>

```html
<div>
  {#fragment:button text}
    <div class="col-sm-6 smallpad">
      <button @@click class="btn">{text}</button>
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

---
Also you can pass slot to fragment,
<a target="_blank" href="https://malinajs.github.io/repl/#/share/jgtdUmDtkJK?version=0.6.36">example</a>

```html
{#fragment:field}
  <div class="field">
    <slot/>
  </div>
{/fragment}

<fragment:field>
  <button>Click</button>
</fragment>

<fragment:field>
  <input type="text" />
</fragment>
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



### Portal

---
Portal lets you render a template outside of component, argument `mount` == 'document.body' by default.
<a target="_blank" href="https://malinajs.github.io/repl/#/share/EQIPLZrARiM?version=0.6.36">example</a>

```html
<malina:portal mount={document.body}>
  <div class="popup">
    <h1>Popup</h1>
    <p>Some text</p>
  </div>
</malina:portal>
```



## head / body / window

---
These special elements lets you handle head/body/window:
<a target="_blank" href="https://malinajs.github.io/repl/#/share/EG0Q_RI2cfo?version=0.6.36">example</a>


```html
<malina:head>
  <title>Set title</title>
  <link rel="stylesheet" href="theme.css" />
</malina:head>
<malina:body @keydown|esc:escape />
<malina:window @scroll />
```


## #keep

---
"Keep-alive" preserves DOM elements instead of removing them and attaches them back on condition.
<a href="https://malinajs.github.io/repl/#/share/WKh93kjvxbg?version=0.7.10">examples 1</a>, <a href="https://malinajs.github.io/repl/#/share/YR649uJ58ed?version=0.7.10">examples 2</a>, <a href="https://malinajs.github.io/repl/#/share/27TO0qZXeyj?version=0.7.10">examples 3</a>

```html
  {#keep key={key}}
    <div />
  {/keep}
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

If you need to detect changes inside of an object (deep-checking), then you can use modifier "deep" or option "deepCheckingProps".

```html
<Component value={expression} {name} {...obj} />

<Component value|deep={expression} />
```


---
You can use keyword `export` to mark a variable as property, so it will receive a value from parent component and will be updated on changes. Also you can export a function, it will be available in instance for parent component <a target="_blank" href="https://malinajs.github.io/repl/#/share/rGdzUaokFp_?version=0.7.9">example</a>

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


## Call child fragment / Inverted slot

---
You can call a fragment from child component, it looks like inverted slot,
<a target="_blank" href="https://malinajs.github.io/repl/#/share/TJLjJATAvKX?version=0.6.39">example</a>


```html
<!-- Child -->
{#fragment:title export}
  <h1 class="header">{name}</h1>
{/fragment}

<!-- App -->
<Child>
  <Child:title>Header</>
</Child>
```


## Anchor

---
It lets you pass controls (classes, events, actions etc) without template to child component.
<a target="_blank" href="https://malinajs.github.io/repl/#/gist/2824bcb54eab5f9b4dded54c59298944?version=0.6.36">example</a>

```html
<!-- App -->
<Child>
  <^root class="border" />
  <^name style="font-weight: bold; color: red" />
  <^input type="text" *action :value />
</Child>

<!-- Child -->
<div ^root>
  <span ^name>Name</span>
  <input ^input />
</div>
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

You can pass classes into child components using property `class`, to be able to use it in child class you have to place such classes in `external` block.
<a target="_blank" href="https://malinajs.github.io/repl/#/gist/065441c1187bfd9ce5f0117b7dbd97f6?version=0.6.36">example</a>, 
<a target="_blank" href="https://malinajs.github.io/repl/#/gist/410bb2c1406ea412ad4b4e75616d9581?version=0.6.36">example2</a>

---
**Syntax**: `class:childClassName="parentClass globalClass"`

In the example, classes `red italic` is passed as class `font` in child component. If class is not passed default styles will be used.

You can pass scoped classes, global classes and use expressions, e.g. `class:font="italic {color}"`

```html
<!-- App -->
<Child class:font="red italic" />

<!-- Child -->
<div class="font">Child</div>

<style external>
  .font {color: blue;}  /* style by default */
</style>
```

---
Default class name for child component is `main`, and you can define it.

* Also you can pass partly global classes (e.g. `.button :global(.title)`)
* Passing pseudo-classes (:hover etc)
* Forward a class further

```html
<!-- App -->
<Child class="red italic" />

<!-- Child -->
<div class="main">Child</div>

<style external main="main">
  .main {color: blue;}  /* style by default */
</style>
```

---
If class name starts with `$` it's marked as external
<a target="_blank" href="https://malinajs.github.io/repl/#/share/0O8PvtvEW37?version=0.6.36">example</a>

```html
<!-- App -->
<Child class="red italic" />

<!-- Child -->
<div class="$main">Child</div>
```


## Bind a component to itself

---
You can use `<malina:self />` to bind a new instance of current component, <a href="https://malinajs.github.io/repl/#/share/wh6jdQQGT_q?version=0.7.10">example</a> how to call itself recursively.

```html
<script>
  export const value = 5;
</script>

<div>
  {value}
  {#if value > 0}
    <malina:self value={value-1} />
  {/if}
</div>
```


# Other

## Mount app to DOM

---
To mount an app to DOM you can use `mount(DOMElement, applicationConstructor, options)` or more light version `mountStatic` if you don't need an ability to unmount it (like root regular application).


```js
import {mount} from 'malinajs';
import App from './App.xht';

mount(document.body, App);
```


## Property

---
If you have an instance of component, you can read/write properties directly, a component should have attribute `property`.

```html
<!-- Component -->
<script property>
  export let value = 0;
</script>

<!-- App -->
<script>
  import Component from './Component.html';
  let comp;

  function increment() {
    comp.value++;
  }
</script>
<Component #comp />
```


## onMount / onDestroy

---
If you need to perform some code after mounting or during destroying a component, you can use built functions `$onMount(fn)`, `$onDestroy(fn)`. You can use `$onDestroy` on different levels of code.

You can delay removing DOM on destroying if you return a promise, <a target="_blank" href="https://malinajs.github.io/repl/#/share/j-JUlbA5lFu?version=0.7.9">example with component</a>, <a target="_blank" href="https://malinajs.github.io/repl/#/share/_ScgSgeWPvB?version=0.7.9">example with action</a>, <a target="_blank" href="https://malinajs.github.io/repl/#/share/2iCAGmabEet?version=0.7.9">example + async/await</a>


```html
<script>
  called_at_start();

  $onMount(() => {...});
  $onDestroy(() => {...});
</script>
<Component #comp />
```


## Turn change-detector off

---
In some cases you can turn off change detection, e.g. if a component doesn't expect changes, like component "Icon":

* If to set attribute `read-only` on script tag, change-detector will be off for this component.
* If you `export const name` instead `export let name`, then some runtime will be omitted for such property.
* Keyword `!no-check` in comment tells compiler to skips such js-block for "detections".


```html
<script read-only>
  export const value = '';

  function foo() {
    // !no-check
    ... some not detected code ...
  }
</script>
```


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

---
Also you can mark whole style-block as global

```html
<style global>
  span { /* ... */ }
</style>
```


## Watch expression, reactivity

---
Using syntax `$:` you can observe changes.

Computed value: `$: value = a + b`, `value` will be changed when an expression gives another result.

To observe changes in expression and call handler: `$: exp, handler()`.
It can contain a few expressions: `$: exp1, exp2, a+b, handler()`.

Handler also can be link to function or statement: `$: exp, (newValue) => console.log(newValue);` or
`$: exp, console.log(exp)` or `$: exp, handler`


```html
<script>
  let name = '';
  $: header = name.toUpperCase();
  $: name, () => console.log(name);
  $: a + b, onChangeSum
</script>

<input type="text" :value={name} />
```


## $context

---
An arbitrary context object of a component, a content is available in child components. For external libs it must be imported from "malinajs" and used during component initialisation.
<a target="_blank" href="https://malinajs.github.io/repl/#/share/NeIq-KUQnTD?version=0.6.36">example</a>

```js
// App.xht
$context.value = 'Test';

// Child.xht
let value = $context.value;

// lib.js
import { $context } from 'malinajs';
let value = $context.value;
```

## Error handling

---
Errors which can't be caught by try-catch is handled by Malina.js and displayed to console, but you can override it.
<a target="_blank" href="https://malinajs.github.io/repl/#/share/b-V7WaMo4iC?version=0.6.36">example</a>

```js
import {configure} from "malinajs/runtime.js";
configure({
  onerror(e) {console.error(e)}
}
```


## malina.config.js

You can override config for any folder, you can save `malina.config.js` in target folder. It lets you use different config/plugins for different folders/libs.

```js
const sassPlugin = require('../plugins/sass.js');

module.exports = function(option, filename) {
  option.passClass = false;
  option.immutable = true;
  option.plugins = [sassPlugin()];
  option.autoimport = name => `import ${name} from './${name}.xht';`;
  return option;
}
```


## Compile options

* warning - (function) to receive warnings
* inlineTemplate - (true/false) convert new line to \n
* hideLabel - (true/false) hide comment tags (labels) from DOM
* compact - (true/false/'full') remove spaces between DOM elements, 'full' removes all spaces.
* autoSubscribe - (true/false) autosubscribe imported stores
* cssGenId - (function) generate hash for css classes
* debugLabel - (true/false) adds info label nodes
* css - (true/false/function) controls how to handle CSS, true - adds css to JS bundle, false - into outside css file, function - intercepts css for manual handling
* passClass - (true/false) passing classes to child component, it's true by default.
* immutable - (true/false) if true it doesn't perform deep comparison of objects
* autoimport - a function to handle missed components e.g. `(name) => "import ${name} from './${name}.xht';";`
* deepCheckingProps - (true/false) deep-checking of value which is passed as property to child component.
* useGroupReferencing - (true/false) using compact way to refer to elements.
