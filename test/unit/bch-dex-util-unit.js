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

  describe('#constructor', () => {
    it('should throw error if instance of minimal-slp-wallet is not passed', () => {
      try {
        uut = new BchDexUtil({})

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet property when instantiating bch-dex-util library.')
      }
    })

    it('should throw error if instance of p2wdb Read lib is not passed', async () => {
      try {
        const wallet = new BchWallet(undefined, { interface: 'consumer-api' })
        await wallet.walletInfoPromise
        uut = new BchDexUtil({ wallet })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of p2wdb Read must be passed as p2wdbRead property when instantiating bch-dex-util library.')
      }
    })
  })

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

  describe('#validateUtxo', () => {
    it('should return true on valid UTXO', async () => {
      // Mock dependencies
      sandbox.stub(uut.wallet, 'utxoIsValid').resolves(true)

      const txHash = 'b94e1ff82eb5781f98296f0af2488ff06202f12ee92b0175963b8dba688d1b40'
      const txPos = 0

      const result = await uut.validateUtxo(txHash, txPos)
      // console.log('result: ', result)

      assert.equal(result, true)
    })
  })
})
