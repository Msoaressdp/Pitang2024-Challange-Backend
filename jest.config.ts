import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2)$': '<rootDir>/.jest/mocks/fileMock.ts',
    '\\.(css|less)$': '<rootDir>/.jest/mocks/fileMock.ts',
  },
};

export default config;