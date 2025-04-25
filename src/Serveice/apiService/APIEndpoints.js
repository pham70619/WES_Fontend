export const APIPaths = {
  // auth
  login: '/23529784/RSI_SINSHIH_1/P1-RS1/Login',
  Register: '/register',

  // order info
  getOrderData: '/23529784/RSI_SINSHIH_1/P1-RS1/GetOrderInfo',
  submitOerderInfo: '/23529784/RSI_SINSHIH_1/P1-RS1/DespathOrderInfo',
  bindingOrderInfo: '/23529784/RSI_SINSHIH_1/P1-RS1/CreateBatch',
  updateOrderInfoPriority: '/23529784/RSI_SINSHIH_1/P1-RS1/UpdateOrderPriority',

  // retrieveload
  getRetrievload: '/23529784/RSI_SINSHIH_1/P1-RS1/GetRetrieveLoad',
  retrieveLoadPriority: '/RetrieveLoad/Priority',

  // inbound pallet info
  getInbound: '/23529784/RSI_SINSHIH_1/P1-RS1/GetInboundPalletInfos',

  // skumaster
  getSKUMaster: '/23529784/RSI_SINSHIH_1/P1-RS1/GetSKUMaster',

  // stock adjustment
  getStockAdjust: '/23529784/RSI_SINSHIH_1/P1-RS1/GetStockAdjustment',

  // menu
  updateMenu: '/Menu/updateMenu',
  deleteMenu: '/Menu/',

  addWMS: '/WMS/add',
  getSettingWMS: '/Setting/WMS/table',
  getSettingWCS: '/Setting/WCS/table',
  getLog: '/Log/Get',
  getAPILog: 'https://39affaab-826e-47fd-ab0d-f028062da98d.mock.pstmn.io/Log/Api/get',
  getLogFile: '/LogName/Get',
  CustomZone: '/Setting/Zone',
  CustomWH: '/Setting/WH',
  CustomPar: '/Setting/Parameter',
  SKUCancel: '/SKU/Cancel',
  OrderCancel: '/Order/Cancel',
  InboundCancel: 'Inbound/Cancel',
  ActivityLog: '/Activity/GetData',
}
