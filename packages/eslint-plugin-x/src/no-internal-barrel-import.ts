import fs from 'fs';
import path from 'path';
import { Rule } from 'eslint';

export default <Rule.RuleModule>{
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow importing from project barrels',
      recommended: true
    },
    schema: [],
    messages: {
      barrelImport: 'Barrels imports are not allowed: `{{path}}`'
    }
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value?.toString();
        if (!importPath || !isRelativeImport(importPath)) return;

        const fileDirectory = path.dirname(context.getPhysicalFilename());
        const fullPath = path.join(fileDirectory, importPath);
        if (isIndexImport(importPath) || isDirectoryImport(fullPath)) {
          context.report({
            node,
            messageId: 'barrelImport',
            data: {
              path: importPath
            }
          });
        }
      }
    };
  }
};

/**
 * Checks whether an import is relative.
 *
 * @param importPath - The import path to check if it is relative.
 * @returns True if the import path is relative.
 */
function isRelativeImport(importPath: string): boolean {
  return importPath.startsWith('.');
}

/**
 * Checks whether an import path is importing a directory.
 *
 * @param importPath - The import path to check if it is a directory.
 * @returns True if the import path is a directory.
 */
function isDirectoryImport(importPath: string): boolean {
  return fs.existsSync(importPath) && fs.lstatSync(importPath).isDirectory();
}

/**
 * Checks if an import path is importing an index file of any extension.
 *
 * @param importPath - The import path to check if it is importing an index file.
 * @returns True if the import path is an index file.
 */
function isIndexImport(importPath: string): boolean {
  const fileName = path.basename(importPath);
  return /^index(\.[^.]+)?$/.test(fileName);
}
