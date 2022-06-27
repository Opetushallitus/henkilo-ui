import { schema } from './DetailsForm';

describe('DetailsForm', () => {
    describe('Verify form validation schema', () => {
        const valid = {
            hetu: '000000-0000',
            etunimet: 'X Æ A-12',
            kutsumanimi: 'Æ',
            sukunimi: 'Musk',
        };

        test.each([
            ['Accepts valid input', valid, true],
            ['Rejects empty ssn', { ...valid, hetu: '' }, false],
            ['Rejects empty name', { ...valid, etunimet: '' }, false],
            ['Rejects empty nick', { ...valid, kutsumanimi: '' }, false],
            ['Rejects partial nick', { ...valid, kutsumanimi: '-' }, false],
            ['Rejects empty last', { ...valid, sukunimi: '' }, false],
            ['Rejects incorrect ssn', { ...valid, hetu: 'test' }, false],
            ['Rejects incorrect nick', { ...valid, kutsumanimi: 'test' }, false],
            ['Rejects multiple nicks', { ...valid, kutsumanimi: 'X Æ A-12' }, false],
            ['Accepts multiple lastNames', { ...valid, sukunimi: 'X Æ A-12' }, true],
            ['Case-insensitive nick comparison', { ...valid, kutsumanimi: 'x' }, true],
        ])('%s', (_, input, expected) => {
            expect(!!!schema.validate(input).error).toEqual(expected);
        });
    });
});