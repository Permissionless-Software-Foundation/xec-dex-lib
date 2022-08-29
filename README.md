# bch-dex-lib

This is a library for use in both browser and node.js JavaScript applications. It incorporates the basic [SWaP protocol](https://github.com/vinarmani/swap-protocol/blob/master/swap-protocol-spec.md) used by [bch-dex](https://github.com/Permissionless-Software-Foundation/bch-dex).

The purpose of this library is build a web and Android app that can let *Takers* purchase tokens using the bch-dex protocol. *Makers* still still need to run the [bch-dex](https://github.com/Permissionless-Software-Foundation/bch-dex) back end to make Offers and accept Counter-Offers. But an app using this library allows Takers to issue a Counter Offer without needing to run back end software.

This library depends on [minimal-slp-wallet](https://www.npmjs.com/package/minimal-slp-wallet) and [p2wdb](https://www.npmjs.com/package/p2wdb). Both of these libraries must be instantiated and passed in as arguments when instantiating this library.

# Licence
[MIT](LICENSE.md)
