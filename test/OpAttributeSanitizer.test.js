
import 'mocha';
import * as assert from 'assert';

import {OpAttributeSanitizer} from './../src/OpAttributeSanitizer';
import {ListType, AlignType, DirectionType} from './../src/value-types'; 

describe('OpAttributeSanitizer', function () {

    describe('#IsValidHexColor()', function() {
        it('should return true if hex color is valid', function() {
            assert.ok(OpAttributeSanitizer.IsValidHexColor('#234'));
            assert.ok(OpAttributeSanitizer.IsValidHexColor('#f23'));
            assert.ok(OpAttributeSanitizer.IsValidHexColor('#fFe234'));
            assert.equal(OpAttributeSanitizer.IsValidHexColor('#g34'), false);

            assert.equal(OpAttributeSanitizer.IsValidHexColor('e34'), false);
            assert.equal(OpAttributeSanitizer.IsValidHexColor('123434'), false);
        });
    });

    describe('#IsValidFontName()', function() {
        it('should return true if font name is valid', function() {
            assert.ok(OpAttributeSanitizer.IsValidFontName('gooD-ol times 2'));
            assert.equal(OpAttributeSanitizer.IsValidHexColor('bad"times?'), false);
        });
    });

    describe('#IsValidSize()', function() {
        it('should return true if size is valid', function() {
            assert.ok(OpAttributeSanitizer.IsValidSize('bigfaT-size'));
            assert.equal(OpAttributeSanitizer.IsValidSize('small.sizetimes?'), false);
        });
    });

    describe('#sanitize()', function() {

        it('should return empty object', function() {
            [null, 3, undefined, "fd"].forEach((v) => {
                assert.deepEqual(OpAttributeSanitizer.sanitize(v), {});
            });
        });

        var attrs = {
            bold: 'nonboolval',
            color: '#12345H',
            background: '#333',
            font: 'times new roman',
            size: 'x.large',
            link: 'http://<',
            script: 'supper',
            list: ListType.Ordered,
            header: '3',
            indent: 40,
            direction: DirectionType.Rtl,
            align: AlignType.Center
        };
        it('should return sanitized attributes', function() {
            assert.deepEqual(OpAttributeSanitizer.sanitize(attrs), {
                bold: false,
                background: '#333',
                font: 'times new roman',
                link: 'http://',
                list: 'ordered',
                header: 3,
                indent: 30,
                direction: 'rtl',
                align: 'center'
            });

            assert.deepEqual(OpAttributeSanitizer.sanitize({header: '1'}), {header: 1});
            assert.deepEqual(OpAttributeSanitizer.sanitize({align: AlignType.Center}), 
                {align: "center"});
            assert.deepEqual(OpAttributeSanitizer.sanitize({direction: DirectionType.Rtl}), 
                {align: "rtl"});
            assert.deepEqual(OpAttributeSanitizer.sanitize({indent: '2'}), 
                {indent: 2});
        });
    });
});