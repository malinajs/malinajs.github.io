#!/usr/bin/env python3

import pymark


def main():
    tpl = open('./index.tpl.html').read()
    raw = open('./index.md').read()
    menu, html = pymark.mark(raw)
    menu_html = build_menu(menu)
    result = tpl.replace('{{content}}', html).replace('{{menu}}', menu_html)
    open('../index.html', 'w').write(result)


def build_menu(menu):
    result = []

    menu_tree = []
    m1 = None
    for (id, name, lvl) in menu:
        if lvl == 1:
            m1 = {
                'id': id,
                'name': name,
                'children': []
            }
            menu_tree.append(m1)
        else:
            m1['children'].append({
                'id': id,
                'name': name,
            })
    
    for a in menu_tree:
        n = '<li class="doc-sidebar-list__item doc-sidebar-list__item--link"> \
            <a href="#{}"><span><b>{}</b></span></a>'.format(a['id'], a['name'])
        if a['children']:
            n += '<ul class="doc-sidebar-list__toc-list">'
            for b in a['children']:
                n += '''
                    <li class="doc-sidebar-list__toc-item">
                      <a href="#{}" data-scroll="true">
                        <span>{}</span>
                      </a>
                    </li>
                '''.format(b['id'], b['name'])
            n += '</ul>'
        n += '</li>'
        result.append(n)

    return '\n'.join(result)

main()
