import { RuleTester } from 'eslint';
import * as module from 'module';
import noInternalBarrelImport from '../no-internal-barrel-import';

describe('no-internal-barrel-import', () => {
  const ruleTester = new RuleTester({
    parserOptions: { sourceType: 'module', ecmaVersion: 2015 }
  });

  ruleTester.run('no-internal-barrel-import', noInternalBarrelImport, {
    valid: [
      `
import { Test0 } from './aindex.js';
import { Test1 } from './index.test.js';
import { Test2 } from './aindex';
import { Test3 } from 'index';
import { Test4 } from '@scope/index';
import { Test5 } from '@scope/package/index';
export * from './index';
export * from './index.js';
    `
    ],
    invalid: [
      createFailingCode(`import { Something } from './index'`),
      createFailingCode(`import { Something } from './index.js'`),
      createFailingCode(`import { Something } from './index.ts'`),
      createFailingCode(`import { Something } from '../index'`),
      createFailingCode(`import { Something } from './folder/index'`),
      createFailingCode(`import { Something } from './folder/index.ts'`),
      createFailingCode(`import Something from './folder'`)
    ]
  });

  function createFailingCode(code: string): RuleTester.InvalidTestCase {
    return {
      code,
      filename: __filename,
      errors: [{ messageId: 'barrelImport' }]
    };
  }
});
