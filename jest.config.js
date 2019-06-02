module.exports = {
    "roots": [
        "<rootDir>/server",
        "<rootDir>/client"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.test.json'
        }
    }
}