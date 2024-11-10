module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src/',
          '@images': './assets/images',
          '@icons': './assets/icons',
          '@constants': './src/constants',
          '@validations': './src/validations',
          '@components': './src/components',
          '@types': './src/types',
          '@screens': './src/screens',
          '@helpers': './src/helpers',
          '@contexts': './src/context',
          '@navigation': './src/navigation',
          '@store': './src/store',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
