// node --test app/utils/files.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { fmtBytes, hostOf } from './files.js'

test('sizes read the way a download button should', () => {
    assert.equal(fmtBytes(142_336), '139 KB')
    assert.equal(fmtBytes(684_032), '668 KB')
    assert.equal(fmtBytes(2_412_544), '2.3 MB')
    assert.equal(fmtBytes(900), '900 B')
    assert.equal(fmtBytes(5_368_709_120), '5.0 GB')
})

test('a missing or nonsense size renders nothing rather than "0 B" or "NaN"', () => {
    for (const v of [0, -1, null, undefined, '', 'big', NaN]) assert.equal(fmtBytes(v), '')
})

test('host strips www and survives an editor-entered non-URL', () => {
    assert.equal(hostOf('https://www.cbj.gov.jo/Pages/viewpage?pageID=132'), 'cbj.gov.jo')
    assert.equal(hostOf('https://dls.gov.jo'), 'dls.gov.jo')
    for (const v of ['dls.gov.jo', '', null, undefined, 'javascript:alert(1)']) {
        assert.equal(hostOf(v), '', String(v))
    }
})
