/*
  Unit tests for the util.js utility library.
*/

// Global npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const cloneDeep = require('lodash.clonedeep')
const BchWallet = require('minimal-slp-wallet/index')
const { Read } = require('p2wdb/index')

// Mocking data libraries.
const mockDataLib = require('./mocks/util-mocks')

// Unit under test
const BchDexUtil = require('../../lib/bch-dex-util')
let uut

describe('#bch-dex-util.js', () => {
  let sandbox, mockData

  before(async () => {
    const wallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await wallet.walletInfoPromise
    const p2wdbRead = new Read()

    uut = new BchDexUtil({ wallet, p2wdbRead })
  })

  beforeEach(() => {
    // Restore the sandbox before each test.
    sandbox = sinon.createSandbox()

    // Clone the mock data.
    mockData = cloneDeep(mockDataLib)
  })

  afterEach(() => sandbox.restore())

  describe('#getEntryFromP2wdb', async () => {
    it('should get an entry from the P2WDB', async () => {
      // Mock dependencies
      sandbox.stub(uut.p2wdbRead, 'getByHash').resolves(mockData.mockP2wdbRead)

      const cid = 'zdpuB1JpvAb6t1Zrj7N7JVg3WTQ3ZEfoZ43nV6cWwLgNpB2gy'

      const result = await uut.getEntryFromP2wdb(cid)
      // console.log('result: ', result)

      assert.property(result, 'isValid')
      assert.property(result, 'value')
    })
  })
})
