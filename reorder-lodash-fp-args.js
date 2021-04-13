const { ALL_METHODS, reorderArgs } = require('./reorder-args');

function isLodashFpImport(node, imported) {
  return node.type === 'ImportDeclaration' && node.source.value.includes('lodash/fp');
}

module.exports = function (fileInfo, { jscodeshift: j }, argOptions) {
  const ast = j(fileInfo.source);
  const { comments, loc } = ast.find(j.Program).get('body', 0).node;

  ast
    .find(j.CallExpression, (node, other) => {
      const isLodashFpCall = ast
        .find(j.ImportDeclaration, isLodashFpImport)
        .find(j.Identifier, n => {
          return n.name === node.callee.name;
        });
      return isLodashFpCall.length == 1;
    })
    .replaceWith(p => {
      const name = p.node.callee.name;
      const args = reorderArgs(name, p.node.arguments);
      return j.callExpression(j.identifier(name), args);
    });

  // Restore opening comments/position
  Object.assign(ast.find(j.Program).get('body', 0).node, { comments, loc });

  return ast.toSource({
    arrowParensAlways: true,
    quote: 'single',
  });
};
