/*
  A mocking library for bch-dex-util.js unit tests.
  A mocking library contains data to use in place of the data that would come
  from an external dependency.
*/

const mockP2wdbRead = {
  isValid: true,
  appId: 'bch-dex-001',
  createdAt: 1661785108577,
  _id: '630cd41463d3530013d2211b',
  hash: 'zdpuB1JpvAb6t1Zrj7N7JVg3WTQ3ZEfoZ43nV6cWwLgNpB2gy',
  key: 'b303635516d9c0d7168f277b06cbbebfeb0a7d0130a949cefc9513d538ecd95e',
  value: {
    message: '2022-08-29T14:58:06.895Z',
    signature: 'H5h5GVoEiU9QGiAkfRSLLJOknY7WcchNsIUfjzHNEpTrVv1oppfh3Z0T5NC6nqJ4WB9CHV4s+IrF2Zq8Plky3yI=',
    data: '{"appId":"bch-dex-001","data":{"$__":{"strictMode":true,"selected":{},"getters":{},"_id":"630cc542ac8d392365406d86","wasPopulated":false,"activePaths":{"paths":{"_id":"init","messageType":"init","messageClass":"init","tokenId":"init","buyOrSell":"init","rateInBaseUnit":"init","minUnitsToExchange":"init","numTokens":"init","utxoTxid":"init","utxoVout":"init","timestamp":"init","localTimestamp":"init","p2wdbHash":"init","offerStatus":"init","makerAddr":"init","ticker":"init","tokenType":"init","__v":"init"},"states":{"ignore":{},"default":{},"init":{"_id":true,"messageType":true,"messageClass":true,"tokenId":true,"buyOrSell":true,"rateInBaseUnit":true,"minUnitsToExchange":true,"numTokens":true,"utxoTxid":true,"utxoVout":true,"timestamp":true,"localTimestamp":true,"p2wdbHash":true,"offerStatus":true,"makerAddr":true,"ticker":true,"tokenType":true,"__v":true},"modify":{},"require":{}},"stateNames":["require","modify","init","default","ignore"]},"pathsToScopes":{},"cachedRequired":{},"session":null,"$setCalled":{},"emitter":{"_events":{},"_eventsCount":0,"_maxListeners":0},"$options":{"skipId":true,"isNew":false,"willInit":true,"defaults":true}},"isNew":false,"$locals":{},"$op":null,"_doc":{"_id":"630cc542ac8d392365406d86","messageType":1,"messageClass":1,"tokenId":"a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2","buyOrSell":"sell","rateInBaseUnit":"8478","minUnitsToExchange":"8478","numTokens":1,"utxoTxid":"5dfd91589f1c0813154da4c2804fa38886cc2e47fa1d73cb8285df786a25c2cc","utxoVout":1,"timestamp":1661781253701,"localTimestamp":"8/29/2022, 6:54:13 AM","p2wdbHash":"zdpuAv1tCSRBrWcG9oisXTMD5mKCUHqivu1StSu18Dexcw87B","offerStatus":"posted","makerAddr":"bitcoincash:qq04t0jhllzztrh2ypxy88ujff5wqv0kpgra2gt40d","ticker":"TROUT","tokenType":1,"__v":0},"$init":true,"partialTxHex":"0200000002ccc2256a78df8582cb731dfa472ecc8688a34f80c2a44d1513081c9f5891fd5d0100000000fffffffff1c9af5484dcc31c5942e5d9ddd5c328deb52c691e2d5499f33b2a6c0e38574f000000006a47304402204adb77767492e3a6c6a7a9f714a4a44375023615c6a2bb9a8b834599f95956ef022042499b4bbcc1cff538cdb08ffce1a4b4d4e6a1184cf5c42c774cb6a56abe1a7f412102682f70e3170734dd24177a1fb5983ab44c3e56de7e1ffd0b773822065e42855cffffffff030000000000000000376a04534c500001010453454e4420a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b208000000000000006422020000000000001976a9141f55be57ffc4258eea204c439f924a68e031f60a88ac1e210000000000001976a9141f55be57ffc4258eea204c439f924a68e031f60a88ac00000000","offerHash":"zdpuAv1tCSRBrWcG9oisXTMD5mKCUHqivu1StSu18Dexcw87B","dataType":"counter-offer"},"timestamp":"2022-08-29T14:58:06.895Z","localTimeStamp":"8/29/2022, 7:58:06 AM"}'
  },
  __v: 0
}

module.exports = {
  mockP2wdbRead
}
