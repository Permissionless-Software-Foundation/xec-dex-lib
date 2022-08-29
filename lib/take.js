/*
  This class library governs the action of Takers or *take* and Offer by
  generating an Counter Offer and uploading it to the P2WDB.
*/

// Local libraries
const BchDexUtil = require('./bch-dex-util')

class Take {
  constructor (localConfig = {}) {
    // Dependency injection
    if (!localConfig.wallet) {
      throw new Error('Instance of minimal-slp-wallet must be passed as wallet property when instantiating Take library.')
    }
    this.wallet = localConfig.wallet
    if (!localConfig.p2wdbRead) {
      throw new Error('Instance of p2wdb Read must be passed as p2wdbRead property when instantiating Take library.')
    }
    this.p2wdbRead = localConfig.p2wdbRead
    if (!localConfig.p2wdbWrite) {
      throw new Error('Instance of p2wdb Write must be passed as p2wdbWrite property when instantiating Take library.')
    }
    this.p2wdbWrite = localConfig.p2wdbWrite

    // Encapsulate dependencies
    this.util = new BchDexUtil(localConfig)
  }

  // This is a top-level function that orchestrates several subfunctions, in
  // order to generate a Counter Offer.
  async takeOffer (cid) {
    try {
      // Get the Offer from the P2WDB.
      const offerData = await this.util.getEntryFromP2wdb(cid)
      console.log('offerData: ', offerData)

      // Verify the UTXO is still valid.
      const txid = offerData.data.utxoTxid
      const vout = offerData.data.utxoVout
      const isValid = await this.util.validateUtxo(txid, vout)
      if (!isValid) {
        throw new Error('Offer is not valid. UTXO has been spent.')
      }

      // Ensure the wallet has enough funds to complete the trade.
      const { hasEnoughFunds, bchAddr } = await this.ensureFunds(offerData)
      console.log('bchAddr: ', bchAddr)
      if (!hasEnoughFunds) {
        throw new Error('This wallet does not have enough BCH to Counter the selected Offer.')
      }

      // Move BCH to a new HD address

      // Generate a partially signed TX and Counter Offer

      // Upload the Counter Offer to P2WDB
    } catch (err) {
      console.error('Error in bch-dex-lib/take.js takeOffer(): ', err)
      throw err
    }
  }

  // Ensure that the wallet has enough BCH to complete the requested
  // trade. Will return true if it does. Will throw an error if it doesn't.
  async ensureFunds (offerData) {
    console.log('offerData: ', offerData)

    // Ensure the app wallet has enough funds to write to the P2WDB.
    const { hasEnoughPsf, hasEnoughBch, bchAddr } = await this.p2wdbWrite.checkForSufficientFunds()
    if (!hasEnoughPsf && !hasEnoughBch) {
      throw new Error('Wallet does not have enough BCH to write to the P2WDB.')
    }
    // console.log('hasEnoughBch: ', hasEnoughBch)
    // console.log('bchAddr: ', bchAddr)

    // Convert BCH cost to sats.
    let hasEnoughSats = 0
    if (hasEnoughBch) {
      hasEnoughSats = this.wallet.bchjs.BitcoinCash.toSatoshi(hasEnoughBch)
    }

    if (offerData.data.buyOrSell.includes('sell')) {
      // Sell Offer

      // Calculate the sats needed
      const satsNeeded = offerData.data.numTokens * parseInt(offerData.data.rateInBaseUnit)
      if (isNaN(satsNeeded)) {
        throw new Error('Could not calculate sats needed!')
      }

      // Ensure the app wallet controlls enough BCH to pay for the tokens.
      const balance = await this.wallet.getBalance()
      console.log(`wallet balance: ${balance}, sats needed: ${satsNeeded}`)
      const SATS_MARGIN = 5000
      const totalSatsNeeded = satsNeeded + SATS_MARGIN + hasEnoughSats
      if (totalSatsNeeded > balance) {
        throw new Error(`Wallet does not control enough BCH to purchase the tokens. It has ${balance} sats, and needs ${totalSatsNeeded} sats.`)
      }

    //
    } else {
      // Buy Offer
      throw new Error('Buy offers are not supported yet.')
    }

    return { hasEnoughFunds: true, bchAddr }
  }
}

module.exports = Take
