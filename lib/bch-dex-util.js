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
    return result
  }
}

module.exports = BchDexUtil
