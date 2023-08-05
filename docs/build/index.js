import fs from 'fs/promises';
import { highlight } from "./highlight.js";
import marked from "marked";
import { JSDOM } from 'jsdom'
import csso from 'csso';

const buildMenu = (html, fileName) => {
  const result = [];

  const menuTree = [];
  let m1 = [];

  if (fileName == "index") {
    menuTree.push({
      name: 'v0.6',
      url: 'v0.6.html'
    });
  }

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

  for (const m of menuTree) {
    const url = m.id ? `#${m.id}` : m.url;
    let n = `<li class="doc-sidebar-list__item doc-sidebar-list__item--link"><a href="${url}"><span><b>${m.name}</b></span></a>`
    if (m.children) {
      n += '<ul class="doc-sidebar-list__toc-list">'
      for (const sub of m.children) {
        n += `
          <li class="doc-sidebar-list__toc-item">
            <a href="#${sub.id}" data-scroll="true">
              <span>${sub.name}</span>
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
  process.chdir('..');

  const build = async (inputFile, outputFile, title, logo) => {
    const name = inputFile.match(/\/([\w.]+)\.md/)[1];
    const input = await fs.readFile(inputFile, 'utf-8')
    const template = await fs.readFile('./src/index.tpl.html', 'utf-8')

    const html = markdownToHTML(input);

    let result = template.replace("{{menu}}", buildMenu(html, name))
      .replace("{{content}}", postprocessMarkup(html))
      .replace("{{title}}", title)
      .replace("{{logo}}", logo);
    await fs.writeFile(outputFile, result, 'utf-8');
  };

  await build('./src/index.md', './index.html', 'Malina.js | API', 'Malina.js');
  await build('./src/v0.6.md', './v0.6.html', 'Malina.js | API v0.6', 'Malina.js v0.6');

  await fs.writeFile('./doc.css', csso.minify(await fs.readFile('./src/css/doc.css')).css)
  await fs.writeFile('./pygments.css', csso.minify(await fs.readFile('./src/css/pygments.css')).css)
})();
