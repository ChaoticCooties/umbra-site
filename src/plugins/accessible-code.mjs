/** Keep long Markdown code samples scrollable with a keyboard in every browser. */
export function accessibleCode() {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.tagName === 'pre') {
        node.properties = {
          ...node.properties,
          tabIndex: 0,
          role: 'region',
          ariaLabel: 'Code sample',
        };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
