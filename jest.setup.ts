import '@testing-library/jest-dom';
import * as dotenv from 'dotenv';

dotenv.config();

/* eslint @typescript-eslint/no-explicit-any: 0 */
if (!global.structuredClone) {
  global.structuredClone = function structuredClone(objectToClone: any) {
    if (objectToClone === undefined) return undefined;
    return JSON.parse(JSON.stringify(objectToClone));
  };
}
