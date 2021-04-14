const uniqBy = require('lodash/fp/uniqBy');
const { ALL_METHODS, reorderArgs, getExtraArgsForAlias } = require('./reorder-args');

function isImport(node, imported) {
  return node.type === 'ImportDeclaration' && node.source.value === imported;
}

function isLodashImport(node) {
  return isImport(node, 'lodash');
}

function transformImport(j, transformer) {
  // console.log(j.__methods);
  return ast => {
    ast.node.source = j.literal('lodash');
    const imports = ast.value.specifiers;
    j(ast).replaceWith(transformer(j, imports));
  };
}

function newLodashFpImport(j, name) {
  return j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier(name))],
    j.literal(`lodash/fp/${name}`)
  );
}
function buildSplitImports(j, imports) {
  return imports.map(({ imported: { name } }) => newLodashFpImport(j, name));
}

function replaceLodashFpImport(oldName, newName) {
  return (j, imports) => {
    return imports
      .filter(({ local: { name } }) => name !== oldName)
      .concat([newLodashFpImport(j, newName)]);
  };
}

function isLodashFpImport(node) {
  return node.type === 'ImportDeclaration' && node.source.value.includes('lodash/fp');
}

function findLodashFpImportsByName(ast, j, name) {
  return ast.find(
    j.ImportDeclaration,
    node => node.type === 'ImportDeclaration' && node.source.value === `lodash/fp/${name}`
  );
}

function addNamedLodashImport(ast, j, name) {
  if (findLodashFpImportsByName(ast, j, name).length !== 0) {
    return;
  }
  const imports = ast // import _ from 'lodash'
    .find(j.ImportDeclaration, isLodashFpImport);
  j(imports.at(imports.length - 1).get()).insertAfter((path, node) => newLodashFpImport(j, name));
}

module.exports = function (fileInfo, { jscodeshift: j }, argOptions) {
  const ast = j(fileInfo.source);
  const { comments, loc } = ast.find(j.Program).get('body', 0).node;

  if (ast.find(j.ImportDeclaration, isLodashImport).length !== 0) {
    ast // import _ from 'lodash'
      .find(j.ImportDeclaration, isLodashImport)
      .forEach(transformImport(j, buildSplitImports));

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
        const extraArgs = getExtraArgsForAlias(p.node.callee.name, p.node.arguments);

        extraArgs.forEach(name => addNamedLodashImport(ast, j, name));

        const { name, args } = reorderArgs(p.node.callee.name, [
          ...p.node.arguments,
          ...extraArgs.map(j.identifier),
        ]);

        // console.log(p.node.arguments);
        // console.log(args);
        if (name !== p.node.callee.name) {
          addNamedLodashImport(ast, j, name);
        }

        return j.callExpression(j.identifier(name), args);
      });
  }

  ast
    .find(j.ImportDeclaration, (node, path) => {
      if (!isLodashFpImport(node)) {
        return false;
      }
      const name = node.specifiers[0].local.name;
      const callCount = ast.find(j.CallExpression, call => {
        return call.callee.name === name;
      }).length;

      const identifierCount = ast.find(j.Identifier, id => id.name === name).length;
      return callCount + identifierCount <= 1;
    })
    .forEach(node => node.replace());

  // Restore opening comments/position
  Object.assign(ast.find(j.Program).get('body', 0).node, { comments, loc });

  return ast.toSource({
    arrowParensAlways: true,
    quote: 'single',
  });
};

module.exports.parser = 'flow';
