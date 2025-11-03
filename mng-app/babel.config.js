module.exports = function (api) {
  api.cache(true);
  return {
    plugins: ["nativewind/babel"],
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@components": "./components",
            "@screens": "./screens",
            "@assets": "./assets",
            "@data": "./data",
          },
        },
      ],
    ],
  };
};
