export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true, // ESM対応
        isolatedModules: true, // Viteのビルドに適した設定
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1', // Viteのエイリアス対応
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // ESMを扱う
};
