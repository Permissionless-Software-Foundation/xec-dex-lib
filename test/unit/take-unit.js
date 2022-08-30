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

    it('should throw an error if wallet has no BCH or PSF tokens', async () => {
      try {
        // Force code path
        sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
          hasEnoughPsf: false,
          hasEnoughBch: false,
          bchAddr: null
        })

        await uut.ensureFunds(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Wallet does not have enough BCH to write to the P2WDB.')
      }
    })

    it('should throw an error if satsNeeded can not be calculated', async () => {
      try {
        // Force code path
        sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
          hasEnoughPsf: false,
          hasEnoughBch: 0.00011074,
          bchAddr: 'bitcoincash:qpckjpvxwxmggdmqj35jkdhxqks9ku0q5gr7nc9yhf'
        })
        sandbox.stub(uut.wallet, 'getBalance').resolves(163456)

        // Force code path
        mockData.offerData01.data.numTokens = 'a'

        await uut.ensureFunds(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Could not calculate sats needed!')
      }
    })

    it('should throw an error if wallet does not have enough BCH', async () => {
      try {
        // Force code path
        sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
          hasEnoughPsf: false,
          hasEnoughBch: 0.00011074,
          bchAddr: 'bitcoincash:qpckjpvxwxmggdmqj35jkdhxqks9ku0q5gr7nc9yhf'
        })
        sandbox.stub(uut.wallet, 'getBalance').resolves(9000)

        await uut.ensureFunds(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Wallet does not control enough BCH to purchase the tokens.')
      }
    })

    it('should throw an error for a "buy" Offer', async () => {
      try {
        // Force code path
        sandbox.stub(uut.p2wdbWrite, 'checkForSufficientFunds').resolves({
          hasEnoughPsf: false,
          hasEnoughBch: 0.00011074,
          bchAddr: 'bitcoincash:qpckjpvxwxmggdmqj35jkdhxqks9ku0q5gr7nc9yhf'
        })
        sandbox.stub(uut.wallet, 'getBalance').resolves(160000)

        // Force code path
        mockData.offerData01.data.buyOrSell = 'buy'

        await uut.ensureFunds(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Buy offers are not supported yet.')
      }
    })
  })

  describe('#moveBch', () => {
    it('should move BCH to the second HD address by default (index 1)', async () => {
      // Mock dependencies
      sandbox.stub(uut.wallet, 'getUtxos').resolves()
      sandbox.stub(uut.wallet, 'send').resolves('fake-txid')

      const result = await uut.moveBch(mockData.offerData01)

      assert.property(result, 'txid')
    })

    it('should throw an error if satsToMove can not be calculated correctly', async () => {
      try {
        mockData.offerData01.data.numTokens = 'a'

        await uut.moveBch(mockData.offerData01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Could not calculate the amount of BCH to generate counter offer')
      }
    })
  })

  describe('#generatePartialTx', () => {
    it('should generate a partial transaction for Type 1 token (fungible)', async () => {
      // Mock dependencies
      sandbox.stub(uut.wallet, 'getTxData').resolves(mockData.txData01)

      const result = await uut.generatePartialTx(mockData.offerData02, mockData.counterOfferUtxo01)

      assert.include(result, '020000000')
    })

    it('should generate a partial transaction for Type 65 token (NFT)', async () => {
      // Mock dependencies
      sandbox.stub(uut.wallet, 'getTxData').resolves(mockData.txData01)

      // Force desired code path
      mockData.offerData02.data.tokenType = 65

      const result = await uut.generatePartialTx(mockData.offerData02, mockData.counterOfferUtxo01)

      assert.include(result, '020000000')
    })

    it('should throw an error for unknown token types', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.wallet, 'getTxData').resolves(mockData.txData01)

        // Force desired code path
        mockData.offerData02.data.tokenType = 14

        await uut.generatePartialTx(mockData.offerData02, mockData.counterOfferUtxo01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Unknown token type of')
      }
    })

    it('should throw an error if token change is generated', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.wallet, 'getTxData').resolves(mockData.txData01)

        // Force desired code path
        sandbox.stub(uut.wallet.bchjs.SLP.TokenType1, 'generateSendOpReturn').returns({
          script: Buffer.from('test'),
          outputs: 2
        })

        await uut.generatePartialTx(mockData.offerData02, mockData.counterOfferUtxo01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Partial purchase of Offers is not yet supported')
      }
    })

    it('should throw an error if needed sats can not be calculated', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.wallet, 'getTxData').resolves(mockData.txData01)

        // Force desired code path
        mockData.offerData02.data.rateInBaseUnit = 'a'

        await uut.generatePartialTx(mockData.offerData02, mockData.counterOfferUtxo01)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Can not calculate needed sats')
      }
    })
  })
})
