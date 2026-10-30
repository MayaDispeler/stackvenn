// Heading anchors (DESIGN §4). Each h2/h3 with an id is wrapped with a sibling link:
//   <div class="hw hw-2"><h2 id="x">Text</h2><a class="anchor" href="#x">#<span>Section titled "Text"</span></a></div>
// The link sits beside the heading, not inside it, so the heading's accessible name stays clean,
// and it is a real, focusable link for keyboard users. Runs after rehypeHeadingIds.
const textOf = (n) => (n.type === 'text' ? n.value : (n.children ?? []).map(textOf).join(''));

/** @param {any} parent */
function wrap(parent) {
  if (!parent.children) return;
  parent.children = parent.children.map((node) => {
    if (node.type !== 'element') return node;
    const level = node.tagName === 'h2' ? 2 : node.tagName === 'h3' ? 3 : 0;
    const id = node.properties?.id;
    if (!level || !id) {
      wrap(node);
      return node;
    }
    return {
      type: 'element',
      tagName: 'div',
      properties: { className: ['hw', `hw-${level}`] },
      children: [
        node,
        {
          type: 'element',
          tagName: 'a',
          properties: { className: ['anchor'], href: `#${id}`, dataPagefindIgnore: '' },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { ariaHidden: 'true' },
              children: [{ type: 'text', value: '#' }],
            },
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['visually-hidden'] },
              children: [{ type: 'text', value: `Section titled "${textOf(node).trim()}"` }],
            },
          ],
        },
      ],
    };
  });
}

export default function rehypeAnchors() {
  return (tree) => wrap(tree);
}
