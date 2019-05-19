module.exports = {
    "roots": [
        "<rootDir>/server"
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