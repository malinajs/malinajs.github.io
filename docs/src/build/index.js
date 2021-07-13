import { highlight } from "./highlight.js";
import marked from "https://cdn.skypack.dev/marked";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const buildMenu = (html) => {
  const result = [];

  const menuTree = [];
  let m1 = [];

  const headings = html.match(/<h([1-3]) (.*?)h\1>/gm);

  for (const i in headings) {
    const level = headings[i].charAt(2);
    const id = headings[i].match(/"(.*?)"/g)[0].slice(1, -1);
    const text = headings[i].match(/>(.*?)</g)[0].slice(1, -1);

    if (level == 1) {
      m1 = {
        id,
        name: text,
        children: [],
      };
      menuTree.push(m1);
    } else {
      m1["children"].push({
        id,
        name: text,
      });
    }
  }

  for (const a in menuTree) {
    let n = `<li class="doc-sidebar-list__item doc-sidebar-list__item--link"><a href="#${menuTree[a].id}"><span><b>${menuTree[a].name}</b></span></a>`
    if (menuTree[a].children) {
      n += '<ul class="doc-sidebar-list__toc-list">'
      for (const b in menuTree[a]["children"]) {
        n += `
          <li class="doc-sidebar-list__toc-item">
            <a href="#${menuTree[a]["children"][b].id}" data-scroll="true">
              <span>${menuTree[a]["children"][b].name}</span>
            </a>
          </li>
        `
      }
      n += "</ul>"
    }
    n += "</li>"
    result.push(n)
  }
  

  return "\n" + result.join("");
};

const postprocessMarkup = (html) => {
  html = html.replace(
    /(<p>+)([\s\S]*?[^`])<pre>/gm,
    (str) =>
      '<div class="columns2">' + str.replace("<pre>", "") + "</div>" + "<pre>",
  );

  const doc = new DOMParser().parseFromString(html, "text/html");

  const divs = doc.querySelectorAll("div");

  for (const i in divs) {
    if (divs[i]) {
      if (
        divs[i]?.nextElementSibling?.tagName === "PRE" &&
        divs[i]?.nextElementSibling?.nextElementSibling?.tagName === "PRE"
      ) {
        continue;
      }

      //присвоение outerHTML почему-то не работает :/
      divs[i].innerHTML = `<div>${divs[i].innerHTML}</div>` +
        divs[i]?.nextElementSibling?.outerHTML;

      divs[i]?.nextElementSibling.remove();
    }
  }

  return doc.body.outerHTML;
};

(async () => {
  const input = await Deno.readTextFile("../index.md");
  const template = await Deno.readTextFile("../index.tpl.html");

  const renderer = new marked.Renderer();
  renderer.code = (code, lang) =>
    `<pre><code class="language-${lang}">${
      highlight(lang, code)
    }</code></pre>\n`;
  renderer.hr = () => "";

  const html = marked(input, { renderer });

  await Deno.writeTextFile(
    "../../index.html",
    template.replace("{{menu}}", buildMenu(html)).replace(
      "{{content}}",
      postprocessMarkup(html),
    ),
  );
})();
