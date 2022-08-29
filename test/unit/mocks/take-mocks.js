/*
  Mock data for unit tests of the take.js library
*/

const offerData01 = {
  appId: 'bch-dex-001',
  data: {
    messageType: 1,
    messageClass: 1,
    tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    buyOrSell: 'sell',
    rateInBaseUnit: 8478,
    minUnitsToExchange: 8478,
    numTokens: 1,
    makerAddr: 'bitcoincash:qq04t0jhllzztrh2ypxy88ujff5wqv0kpgra2gt40d',
    ticker: 'TROUT',
    utxoTxid: '5dfd91589f1c0813154da4c2804fa38886cc2e47fa1d73cb8285df786a25c2cc',
    utxoVout: 1,
    tokenType: 1,
    dataType: 'offer'
  },
  timestamp: '2022-08-29T13:54:13.701Z',
  localTimeStamp: '8/29/2022, 6:54:13 AM'
}

module.exports = {
  offerData01
}
