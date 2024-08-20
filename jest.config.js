module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/testUtils/singleton.ts'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
