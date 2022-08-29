/*
  Top level library file. This aggregates the other libraries into a single
  library file.
*/

'use strict'

// Local libraries
const Take = require('./lib/take')

// const BCHJS = require('@psf/bch-js')

// const Util = require('./lib/bch-dex-util')
// const util = new Util()

class BchDexLib {
  constructor (localConfig = {}) {
    // Dependency injection
    if (!localConfig.wallet) {
      throw new Error('Instance of minimal-slp-wallet must be passed as wallet property when instantiating the bch-dex-lib library.')
    }
    this.wallet = localConfig.wallet
    if (!localConfig.p2wdbRead) {
      throw new Error('Instance of p2wdb must be passed as wallet property when instantiating the bch-dex-lib library.')
    }
    this.p2wdbRead = localConfig.p2wdbRead
    if (!localConfig.p2wdbWrite) {
      throw new Error('Instance of p2wdb Write must be passed as p2wdbWrite property when instantiating the bch-dex-lib library.')
    }
    this.p2wdbWrite = localConfig.p2wdbWrite

    const depenencies = {
      wallet: this.wallet,
      p2wdbRead: this.p2wdbRead
    }

    this.take = new Take(depenencies)
  }
}

module.exports = BchDexLib
