# xec-dex-lib

This is a library for use in both browser and node.js JavaScript applications. It incorporates the basic [SWaP protocol](https://github.com/vinarmani/swap-protocol/blob/master/swap-protocol-spec.md) used by [xec-dex](https://github.com/Permissionless-Software-Foundation/xec-dex).

The purpose of this library is build a web and Android app that can let *Takers* purchase tokens using the xec-dex protocol. *Makers* still still need to run the [xec-dex](https://github.com/Permissionless-Software-Foundation/xec-dex) back end to make Offers and accept Counter-Offers. But an app using this library allows Takers to issue a Counter Offer without needing to run back end software.

This library depends on [minimal-ecash-wallet](https://www.npmjs.com/package/minimal-ecash-wallet) and [p2wdb](https://www.npmjs.com/package/p2wdb). Both of these libraries must be instantiated and passed in as arguments when instantiating this library.

## Installation

`npm install --save-exact xec-dex-lib`

## Usage

```js
async function start() {
  try {
    // Global npm libraries
    const XecWallet = require('minimal-ecash-wallet')
    const { Read, Write } = require('p2wdb')

    // Customize the two variables below for your own test. The mnemonic
    // should control about $0.20 USD of BCH. The p2wdbHash should be for a
    // valid Offer in the market.
    const mnemonic = 'gaze result fortune pulse jeans lucky tape build maximum puppy urban size'
    const p2wdbHash = 'zdpuAvWMYm7bfHTxbNwsWYmrkK3cnhtH2MzQ7QS74uYbkM3ja'

    // Instantiate dependencies
    const wallet = new XecWallet(mnemonic, { interface: 'consumer-api' })
    await wallet.walletInfoPromise
    const p2wdbRead = new Read()
    const p2wdbWrite = new Write({ wif: wallet.walletInfo.privateKey, interface: 'consumer-api' })

    // Instantiate the Take library.
    const take = new Take({ wallet, p2wdbRead, p2wdbWrite })

    // Generate a Counter Offer to take the other side of the trade expressed in the Offer.
    const hash = await this.p2wdbWrite.postEntry(counterOfferData, offerData.appId)

    console.log(`Counter Offer generated with P2WDB entry ${hash}`)
  } catch(err) {
    console.error(err)
  }
}
start()
```

## Donate

This open source software is developed and maintained by the [Permissionless Software Foundation](https://psfoundation.cash). If this library provides value to you, please consider making a donation to support the PSF developers:

<div align="center">
<img src="./diagrams/donation-qr.png" />
<p>bitcoincash:qqsrke9lh257tqen99dkyy2emh4uty0vky9y0z0lsr</p>
</div>

# Licence
[MIT](LICENSE.md)
