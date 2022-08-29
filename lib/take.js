/*
  This class library governs the action of Takers or *take* and Offer by
  generating an Counter Offer and uploading it to the P2WDB.
*/

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
  }
}

module.exports = Take
