/*
  Unit tests for the take.js library.
*/

// Global npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const cloneDeep = require('lodash.clonedeep')
const BchWallet = require('minimal-slp-wallet/index')
const { Read, Write } = require('p2wdb/index')

// Mocking data libraries.
const mockDataLib = require('./mocks/take-mocks')

// Unit under test
const Take = require('../../lib/take')
let uut

describe('#take.js', () => {
  let sandbox, mockData

  before(async () => {
    const wallet = new BchWallet(undefined, { interface: 'consumer-api' })
    await wallet.walletInfoPromise
    const p2wdbRead = new Read()

    const wif = 'L1tcvcqa5PztqqDH4ZEcUmHA9aSHhTau5E2Zwp1xEK5CrKBrjP3m'
    const p2wdbWrite = new Write({ wif, interface: 'consumer-api' })

    uut = new Take({ wallet, p2wdbRead, p2wdbWrite })
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
        uut = new Take({})

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of minimal-slp-wallet must be passed as wallet property when instantiating Take library.')
      }
    })

    it('should throw error if instance of p2wdb Read lib is not passed', async () => {
      try {
        const wallet = new BchWallet(undefined, { interface: 'consumer-api' })
        await wallet.walletInfoPromise

        uut = new Take({ wallet })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of p2wdb Read must be passed as p2wdbRead property when instantiating Take library.')
      }
    })

    it('should throw error if instance of p2wdb Write lib is not passed', async () => {
      try {
        const wallet = new BchWallet(undefined, { interface: 'consumer-api' })
        await wallet.walletInfoPromise
        const p2wdbRead = new Read()

        uut = new Take({ wallet, p2wdbRead })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Instance of p2wdb Write must be passed as p2wdbWrite property when instantiating Take library.')
      }
    })
  })

  describe('#ensureFunds', () => {
    it('should return true if WIF controls enough BCH and no PSF tokens', async () => {
      // Mock dependencies
      sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
        hasEnoughPsf: false,
        hasEnoughBch: 0.00011074,
        bchAddr: 'bitcoincash:qpckjpvxwxmggdmqj35jkdhxqks9ku0q5gr7nc9yhf'
      })
      sandbox.stub(uut.wallet, 'getBalance').resolves(163456)

      const result = await uut.ensureFunds(mockData.offerData01)

      assert.equal(result.hasEnoughFunds, true)
      assert.include(result.bchAddr, 'bitcoincash:')
    })
  })
})
