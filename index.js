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