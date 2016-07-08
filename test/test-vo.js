'use strict';

const Should = require('should');
const VO = require('../index');

class voExtension2 extends VO {
    constructor(config) {
        super();
        this._addProperties(config);
    }

    get prop1() {return this.get('prop1');}
    get prop2() {return this.get('prop2');}
}

describe('VO', function() {

    it('Should be extendable', function() {
        class voExtension extends VO {}
    });

    it('Should enable creation of immutable objects', function() {
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

    it('Should not throw an error when constructing using invalid parameters if dontThrowErrorOnInvalidKey=true', function() {
        class voExtension2 extends VO {
            constructor(config) {
                super();
                this._addProperties(config, true);
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

        Should.not.exist(err);
    });

    describe('toJsObj', function() {

        it('Should convert a simple VO into appropriate native JS object', function() {
            const voObj = new voExtension2({prop1: 'Hello, world!', prop2: 'Boom!'});
            const obj = voObj.toJsObj();

            Should.exist(obj);
            obj.should.deepEqual({prop1: 'Hello, world!', prop2: 'Boom!'});
        });

        it('Should convert nested VOs into appropriate native JS object', function() {
            const voObj1 = new voExtension2({prop1: 'Hello, world!', prop2: 'Boom!'});
            const voObj2 = new voExtension2({prop1: 'Harder to do', prop2: voObj1});
            const obj = voObj2.toJsObj();

            Should.exist(obj);
            obj.should.deepEqual({
                prop1: 'Harder to do',
                prop2: {
                    prop1: 'Hello, world!',
                    prop2: 'Boom!'
                }
            });
        });

        it('Should convert array of nested VOs into appropriate native JS object', function() {
            const voObj1 = new voExtension2({prop1: 'Obj 1', prop2: 'Obj 1 again'});
            const voObj2 = new voExtension2({prop1: 'Obj 2', prop2: 'Obj 2 again'});

            const voObj3 = new voExtension2({prop1: [voObj1, 'Some value', voObj2], prop2: 'Not cool yet'});

            const voObj4 = new voExtension2({prop1: 10, prop2: voObj3});

            const obj = voObj4.toJsObj();

            Should.exist(obj);
            obj.should.deepEqual({
                prop1: 10,
                prop2: {
                    prop1: [
                        {prop1: 'Obj 1', prop2: 'Obj 1 again'},
                        'Some value',
                        {prop1: 'Obj 2', prop2: 'Obj 2 again'}
                    ],
                    prop2: 'Not cool yet'
                }
            });
        });

    });

    describe('toJSON', function() {

        it('Should convert a simple VO into appropriate native JS object', function() {
            const voObj = new voExtension2({prop1: 'Hello, world!', prop2: 'Boom!'});
            const obj = JSON.parse(JSON.stringify(voObj));

            Should.exist(obj);
            obj.should.deepEqual({prop1: 'Hello, world!', prop2: 'Boom!'});
        });

        it('Should convert nested VOs into appropriate native JS object', function() {
            const voObj1 = new voExtension2({prop1: 'Hello, world!', prop2: 'Boom!'});
            const voObj2 = new voExtension2({prop1: 'Harder to do', prop2: voObj1});
            const obj = JSON.parse(JSON.stringify(voObj2));

            Should.exist(obj);
            obj.should.deepEqual({
                prop1: 'Harder to do',
                prop2: {
                    prop1: 'Hello, world!',
                    prop2: 'Boom!'
                }
            });
        });

        it('Should convert array of nested VOs into appropriate native JS object', function() {
            const voObj1 = new voExtension2({prop1: 'Obj 1', prop2: 'Obj 1 again'});
            const voObj2 = new voExtension2({prop1: 'Obj 2', prop2: 'Obj 2 again'});

            const voObj3 = new voExtension2({prop1: [voObj1, 'Some value', voObj2], prop2: 'Not cool yet'});

            const voObj4 = new voExtension2({prop1: 10, prop2: voObj3});

            const obj = JSON.parse(JSON.stringify(voObj4));

            Should.exist(obj);
            obj.should.deepEqual({
                prop1: 10,
                prop2: {
                    prop1: [
                        {prop1: 'Obj 1', prop2: 'Obj 1 again'},
                        'Some value',
                        {prop1: 'Obj 2', prop2: 'Obj 2 again'}
                    ],
                    prop2: 'Not cool yet'
                }
            });
        });

    });
    
});
