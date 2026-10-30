// Turns a paragraph that holds only an image (optionally followed by an italic line) into
// <figure><img><figcaption>, so captions are semantic. Markdown stays plain:
//   ![alt](src)
//   *Caption text*
const isBlank = (n) => n.type === 'text' && !n.value.trim();

/** @param {any} node */
function toFigure(node) {
  const kids = node.children.filter(
    (c) => !isBlank(c) && !(c.type === 'element' && c.tagName === 'br'),
  );
  const [img, cap, ...rest] = kids;
  if (rest.length || !img || img.type !== 'element' || img.tagName !== 'img') return null;
  if (cap && !(cap.type === 'element' && cap.tagName === 'em')) return null;
  const children = [img];
  if (cap)
    children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: cap.children,
    });
  return { type: 'element', tagName: 'figure', properties: {}, children };
}

export default function rehypeFigure() {
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} parent */
    const walk = (parent) => {
      if (!parent.children) return;
      parent.children = parent.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'p') return toFigure(child) ?? child;
        walk(child);
        return child;
      });
    };
    walk(tree);
  };
}
