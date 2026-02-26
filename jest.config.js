module.exports = {
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleDirectories: [
    'node_modules',          // این خط مهمه — Jest رو مجبور می‌کنه از root node_modules استفاده کنه
    '<rootDir>'              // root پروژه
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!inquirer|@inquirer)/'
  ],
};
