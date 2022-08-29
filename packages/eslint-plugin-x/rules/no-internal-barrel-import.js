const fs = require('fs');
const path = require('path');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow importing from project barrels',
      recommended: true
    },
    schema: [],
    messages: {
      barrelImport: 'Barrels imports are not allowed'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        // console.log('ImportDeclaration', node.source.value);
        const importPath = node.source.value;
        if (!isRelativeImport(importPath)) return;
        const fileDirectory = path.dirname(context.getPhysicalFilename());

        if (isIndexImport(importPath) || isDirectoryImport(path.join(fileDirectory, importPath))) {
          context.report({
            node,
            messageId: 'barrelImport'
          });
        }
      }
    };
  }
};

function isRelativeImport(importPath) {
  return importPath.startsWith('.');
}
function isDirectoryImport(importPath) {
  try {
    return fs.lstatSync(importPath).isDirectory();
  } catch {
    return false;
  }
}
function isIndexImport(importPath) {
  const fileName = path.basename(importPath);
  return (
    (fileName.includes('.') ? fileName.split('.').slice(0, -1).join('.') : fileName) === 'index'
  );
}
