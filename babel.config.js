module.exports = function(api) {
	api.cache(true)
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			[
				"module:react-native-dotenv", {
					"envName": "APP_ENV",
					"moduleName": "@env",
					"path": ".env",
					"blocklist": null,
					"allowlist": null,
					"safe": false,
					"allowUndefined": true,
					"verbose": false
					
				}
			],
			[
				'module-resolver',
				{
					root: ["./"],
					alias: {
						"@styles": "./styles",
						"@assets": "./assets",
						"@screens": "./screens",
						"@components": "./components",
						"@utils": "./utils",
						"@controllers": "./controllers",
					}
				}
			],
			...[
				'react-native-classname-to-style',
				[
					'react-native-platform-specific-extensions', 
					{ extensions: ["scss", "sass"] }
				]
			],
			[
				'react-native-reanimated/plugin', {
					relativeSourceLocation: true
				}
			]
		]
	}
};
