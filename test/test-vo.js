'use strict';

const Should = require('should');
const VO = require('../index');

describe('VO', function() {

    it('Should be extendable', function() {
        class voExtension extends VO {}
    });

    it('Should enable creation of immutable objects', function() {
        class voExtension2 extends VO {
            constructor(config) {
                super();
                this._addProperties(config);
            }

            get prop1() {return this.get('prop1');}
            get prop2() {return this.get('prop2');}
        }

        const instance = new voExtension2({prop1: 'hello', prop2: 'world'});
        instance.prop1.should.eql('hello');
        instance.prop2.should.eql('world');

        let err = null;
        try {
            instance.prop1 = 'oops';
        } catch (e) {
            err = e
        }
        Should.exist(err);

        err = null;
        try {
            instance.prop2 = 'oops';
        } catch (e) {
            err = e
        }
        Should.exist(err);
    });

    it('Should throw an error when constructing using invalid parameters', function() {
        class voExtension2 extends VO {
            constructor(config) {
                super();
                this._addProperties(config);
            }

            get prop1() {return this.get('prop1');}
            get prop2() {return this.get('prop2');}
        }

        let err = null;
        try {
            const vo = new voExtension2({prop1: 'prop1', prop2: 'prop2', prop3: 'prop3'});
        } catch(e) {
            err = e;
        }

        Should.exist(err);
    });
    
});
