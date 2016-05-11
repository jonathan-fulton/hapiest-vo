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

    toJsObj() {
        let jsObj = this._immutableMap.toJS();

        jsObj = _.mapValues(jsObj, (propValue) => {
                if (propValue instanceof VO) {
            return propValue.toJsObj(); // recursively convert VOs to JS objects
        } else {
            return propValue;
        }
    });

        return jsObj;
    }

    get(propName) {
        return this._immutableMap.get(propName);
    }
}

module.exports = VO;