'use strict';

const _ = require('lodash');
const Immutable = require('immutable');

/**
 * Abstract class VO that provides common functions for VOs
 */
class VO {

    constructor() {
        this._immutableMap = Immutable.Map();
    }

    /**
     * @param {Object} object
     * @param {Boolean} [dontThrowErrorOnInvalidKey=false] - use this flag if you use VOs to represent db tables; allows de-coupling database migrations and code changes, a necessity in production
     * @private
     */
    _addProperties(object, dontThrowErrorOnInvalidKey) {
        dontThrowErrorOnInvalidKey = dontThrowErrorOnInvalidKey || false;

        let map = this._immutableMap.toJS();
        Object.assign(map, object);
        this._immutableMap = Immutable.Map(map);

        if (!dontThrowErrorOnInvalidKey) {

            /**
             * Note, this is a bit of a hack.  Here's the logic:
             * 1) Set all the values passed to us
             * 2) Check that we can retrieve all the values using the expected getters (they should match the object keys)
             * 3) Throw an error if we get an undefined value back b/c that implies the getter doesn't exist
             *
             * I would like to simply validate the object keys against list of getters but
             * there's no node.js function that gets those right now, at least that I could find.
             */
            Object.keys(object).forEach(key => {
                if (typeof(this[key]) === 'undefined' && typeof(object[key]) !== 'undefined') {
                    throw new Error(`Invalid object key (${key}) passed to VO _addProperties.  Remove the key or define an associated method.`);
                }
            });
        }
    };

    // @TODO: deprecate this method
    toJsObj() {
        const jsObjFromMap = this._immutableMap.toJS();
        const jsObj = _.mapValues(jsObjFromMap, propValue => Internal.toJsObj(propValue));
        return jsObj;
    }

    // Override default JSON.stringify behavior to output a clean JSON representation
    toJSON() {
        const jsObj = this.toJsObj();
        return jsObj;
    }

    get(propName) {
        return this._immutableMap.get(propName);
    }
}

module.exports = VO;

class Internal {

    static toJsObj(value) {
        if (value instanceof VO) {
            return value.toJsObj(); // recursively convert VOs to JS objects
        } else if (Array.isArray(value)) {
            const resultArray = [];
            value.forEach((result, index) => {
                resultArray[index] = Internal.toJsObj(result);
            });
            return resultArray;
        } else {
            return value;
        }
    }

}