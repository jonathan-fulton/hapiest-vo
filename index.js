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

    _addProperties(object) {
        let map = this._immutableMap.toJS();
        Object.assign(map, object);
        this._immutableMap = Immutable.Map(map);
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