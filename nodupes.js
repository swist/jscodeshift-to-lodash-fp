module.exports = function (file, { jscodeshift: j }, argOptions) {
  const imports = j(file.source).find(j.ImportDeclaration).nodes();

  const newImports = imports.reduce((acc, v, i, arr) => {
    const source = v.source.value;
    if (acc[source]) {
      acc[source].push(v);

      return acc;
    }

    acc[source] = [v];

    return acc;
  }, {});

  const omit = [];

  return j(file.source)
    .find(j.ImportDeclaration)
    .filter(i => newImports[i.node.source.value].length > 1)
    .replaceWith(p => {
      const source = p.node.source.value;

      if (p.node.specifiers[0].type === 'ImportNamespaceSpecifier') {
        return p.node;
      }

      const imports = newImports[source].reduce((acc, v, i, arr) => {
        return [...acc, ...v.specifiers.filter(i => i.type !== 'ImportNamespaceSpecifier')];
      }, []);

      p.node.specifiers = imports;

      if (omit[source]) {
        return '';
      }

      omit[source] = true;

      return p.node;
    })
    .toSource();
};
module.exports.parser = 'flow';
