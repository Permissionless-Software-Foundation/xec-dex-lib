/*
  The tests in this file require a wallet with BCH.
*/

// Global npm libraries
const BchWallet = require('minimal-slp-wallet/index')
const { Read, Write } = require('p2wdb/index')

// Local libraries
const Take = require('../../lib/take')
const mockData = require('../unit/mocks/take-mocks')

describe('#take.js', () => {
  describe('#ensureFunds', () => {
    it('should return true if a wallet has some BCH', async () => {
      // Ensure the wallet below has at least 25,000 sats, and no PSF tokens.

      const WIF = 'L1tcvcqa5PztqqDH4ZEcUmHA9aSHhTau5E2Zwp1xEK5CrKBrjP3m'
      // BCH Address: bitcoincash:qqkg30ryje97al52htqwvveha538y7gttywut3cdqv
      // SLP Address: simpleledger:qqkg30ryje97al52htqwvveha538y7gttyz8q2dd7j

      const wallet = new BchWallet(WIF, { interface: 'consumer-api' })
      await wallet.walletInfoPromise
      const p2wdbRead = new Read()
      const p2wdbWrite = new Write({ wif: WIF, interface: 'consumer-api' })

      const take = new Take({ wallet, p2wdbRead, p2wdbWrite })

      const result = await take.ensureFunds(mockData.offerData01)
      console.log('result: ', result)
    })
  })
})
