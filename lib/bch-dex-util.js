/*
  This utility library contains functions that are used by the other libraries.
  This is a place to store function that are shared by multiple libraries.
*/

// Global npm libraries

class BchDexUtil {
  constructor (localConfig = {}) {
    // Dependency injection
    if (!localConfig.wallet) {
      throw new Error('Instance of minimal-slp-wallet must be passed as wallet property when instantiating bch-dex-util library.')
    }
    this.wallet = localConfig.wallet
    if (!localConfig.p2wdbRead) {
      throw new Error('Instance of p2wdb Read must be passed as p2wdbRead property when instantiating bch-dex-util library.')
    }
    this.p2wdbRead = localConfig.p2wdbRead
  }

  // Get an entry from the P2WDB, given the CID for the entry. This should start
  // with the letter 'z'
  async getEntryFromP2wdb (cid) {
    const result = await this.p2wdbRead.getByHash(cid)
    // console.log('raw data: ', result)

    const strData = result.value.data

    let data
    try {
      data = JSON.parse(strData)
    } catch (err) {
      data = result.value.data
    }

    return data
  }

  // Returns true if a UTXO is still unspent. False if not. Requires the
  // txid (tx_hash) and vout (tx_pos) of the UTXO.
  /*eslint-disable */
  async validateUtxo(tx_hash, tx_pos) {
    const utxo = {tx_hash, tx_pos}
    /* eslint-enable */

    const result = await this.wallet.utxoIsValid(utxo)
    // console.log('validateUtxo result: ', result)

    return result
  }

  // This method returns an object that contains a private key WIF, public address,
  // and the index of the HD wallet that the key pair was generated from.
  async getKeyPair (hdIndex = 0) {
    const mnemonic = this.wallet.walletInfo.mnemonic

    if (!mnemonic) {
      throw new Error('Wallet does not have a mnemonic. Can not generate a new key pair.')
    }

    // root seed buffer
    const rootSeed = await this.wallet.bchjs.Mnemonic.toSeed(mnemonic)

    const masterHDNode = this.wallet.bchjs.HDNode.fromSeed(rootSeed)

    const childNode = masterHDNode.derivePath(`m/44'/245'/0'/0/${hdIndex}`)

    const cashAddress = this.wallet.bchjs.HDNode.toCashAddress(childNode)
    console.log('Generating a new key pair for cashAddress: ', cashAddress)

    const wif = this.wallet.bchjs.HDNode.toWIF(childNode)

    const outObj = {
      cashAddress,
      wif,
      hdIndex
    }

    return outObj
  }
}

module.exports = BchDexUtil
