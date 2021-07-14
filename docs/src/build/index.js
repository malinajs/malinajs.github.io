import fs from 'fs/promises';
import { highlight } from "./highlight.js";
import marked from "marked";
import { JSDOM } from 'jsdom'

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
  const { document } = (new JSDOM(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/></head><body>${html}</body></html>`)).window;
  document.querySelectorAll('.columns2').forEach(tag => {
    let div = document.createElement('div');
    let div2 = document.createElement('div');
    tag.appendChild(div);
    tag.appendChild(div2);
    while(true) {
      let next = tag.nextElementSibling;
      if(next.nodeName == 'PRE') {
        div2.appendChild(next);
        break;
      } else div.appendChild(next);
    }
  });
  return document.body.outerHTML;
}

const markdownToHTML = (md) => {
  const renderer = new marked.Renderer()

  renderer.code = (code, lang) => `<pre><code class="language-${lang}">${highlight(lang, code)}</code></pre>`

  md = md.replace(/\n---\n/g, '\n<div class="columns2"></div>\n\n');

  return marked(md, { renderer })
}

(async () => {
  const input = await fs.readFile('../index.md', 'utf-8')
  const template = await fs.readFile('../index.tpl.html', 'utf-8')

  const html = markdownToHTML(input);

  await fs.writeFile('../../index.html', template.replace("{{menu}}", buildMenu(html)).replace("{{content}}", postprocessMarkup(html)), 'utf-8')
})();
