export const testEnvironment = 'jest-environment-jsdom';
export const setupFilesAfterEnv = ['<rootDir>/jest.setup.js'];
export const extensionsToTreatAsEsm = ['.ts', '.tsx'];
export const moduleNameMapper = {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
};
export const transform = {
 
    '^.+\\.(t|j)sx?$': 'babel-jest',
};