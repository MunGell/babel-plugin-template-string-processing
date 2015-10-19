export default function ({ Plugin, types: t }) {
    /**
     * Plugin Name
     * @type {String}
     */
    const pluginName = 'babel-plugin-template-string-processing';

    /**
     * Processes string with given processors
     * @param {String} string - code to be evaluated
     * @param {Array} options - an array of processors to be applied
     * @return {String} processed code
     */
    const processor = (string, options) => {
        options.forEach((transformer) => {
            let module = require('template-string-processing-' + transformer.type);
            string = module(string, transformer);
        });
        return string;
    };

    /**
     * Selects appropriate processors based on the beginning of the string
     * @param {Array} quasis - node quasis, array of objects
     * @param {Array} options - array of all known processors
     * @return {Array} array of processors that should be applied to the string
     */
    const selectProcessor = (quasis, options) => {
        let stringStart = quasis.length > 0 ? String(quasis[0].value.cooked) : '';

        return options.filter((option) => {
            return stringStart.indexOf('~' + option.type) === 0;
        });
    };

    return new Plugin(pluginName, {
        visitor: {
            TemplateLiteral: function(node, parent, scope, file) {
                let options = file.opts.extra.hasOwnProperty(pluginName) ? file.opts.extra[pluginName] : null;
                let processors = selectProcessor(node.quasis, options);

                if (processors.length > 0) {
                    let strings = [];

                    for (let elem of node.quasis) {
                        strings.push(elem.value.cooked);
                    }

                    // @todo: find better way of processing whole string
                    strings = processor(strings.join('${###}'), options).split('${###}');

                    for (let elem in node.quasis) {
                        node.quasis[elem].value.cooked = strings[elem];
                    }

                    return node;
                }
            }
        }
    });
};
