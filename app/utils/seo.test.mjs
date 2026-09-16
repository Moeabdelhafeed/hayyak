// node --test app/utils/seo.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { fillPattern, clampMeta } from './seo.js'

const EN = '{beds} {type} {deal} in {place}{size}'
const AR = '{type} {beds} {deal} في {place}{size}'

test('fills every placeholder', () => {
    assert.equal(
        fillPattern(EN, { beds: '3-Bed', type: 'Apartment', deal: 'For Sale', place: 'Tabarbour', size: ', 133m²' }),
        '3-Bed Apartment For Sale in Tabarbour, 133m²',
    )
})

test('missing parts collapse instead of leaving gaps or stray separators', () => {
    // Land has no bedrooms; some records have no size.
    assert.equal(
        fillPattern(EN, { beds: '', type: 'Land', deal: 'For Sale', place: 'Na\'ur', size: '' }),
        'Land For Sale in Na\'ur',
    )
    assert.equal(fillPattern(EN, { type: 'Villa', deal: 'For Rent', place: 'Abdoun' }), 'Villa For Rent in Abdoun')
})

test('arabic comma is treated as a separator too', () => {
    assert.equal(
        fillPattern(AR, { beds: '3 غرف', type: 'شقة', deal: 'للبيع', place: 'طبربور', size: '، 133م²' }),
        'شقة 3 غرف للبيع في طبربور، 133م²',
    )
})

test('an empty record yields an empty string, never "undefined"', () => {
    assert.equal(fillPattern(EN, {}), 'in')
    assert.equal(fillPattern(undefined, {}), '')
    assert.ok(!fillPattern(EN, {}).includes('undefined'))
})

test('clampMeta cuts on a word boundary', () => {
    assert.equal(clampMeta('<p>one two three</p>'), 'one two three')
    assert.equal(clampMeta('one two three', 9), 'one two…')
})
