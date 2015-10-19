# Template String Transformation Babel plugin

This plugin allows you to process Template Strings with any transformers defined in `.babelrc` file based on string prefix.
Please note that transformers will be applied in the same order they listed in configuration.

## Example

`.babelrc` configuration: 

```json
{
    "plugins": [
        "babel-plugin-template-string-processing"
    ],
    "extra": {
        "babel-plugin-template-string-processing": [
            {
                "type": "postcss",
                "options": [
                    "postcss-nested",
                    ["autoprefixer", { browsers: ['last 10 versions'] }]
                ]
            }
        ]
    }
}
```

Template String in JavaScript file:

```js
function style() {

    return `~postcss
        .block {
            display: flex;

            &__element {

            }
        }
    `;

}

```

Result:

```js
function style() {
    return '.block { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; } .block__element {}';
}
```

Please not how transformer prefix (`type` in plugin configuration) starts with `~` character.


## Available transformers

- [PostCSS](https://github.com/MunGell/template-string-processing-postcss)

## How to write your own transformer

Transformer is a simple function that takes `string` (code) and tranformer options as parameters and returns processed string.

