// test url
// export const APIServer = 'http://172.20.170.85:5001/UI'
// export const APIServer = 'http://172.20.170.85:7001/UI'

// test get skumaster data (test ngay 16/1/2025)
// export const APIServer = 'http://10.35.10.82:7001/UI'
//

export const APIServer = 'http://10.35.10.82:5001/UI'

//mockserver test url
// export const APIServer = 'https://39affaab-826e-47fd-ab0d-f028062da98d.mock.pstmn.io'

//mockoon test url
// export const APIServer = 'http://localhost:13000'

export const APIPaths = {
  // Login: 'https://39affaab-826e-47fd-ab0d-f028062da98d.mock.pstmn.io/auth/login',
  // Login: 'http://10.35.10.82:7001/UI/auth/login', //7001
  // Login: 'http://10.35.9.28:7001/UI/auth/login', //7001
  Login: 'http://10.35.10.83:5000/UI/Auth/login',
  Register: '/register',
  // 5001==========================================================
  getOrderData: (batch, skip) =>
    // http://10.35.10.82:5001/UI/Outbound/Order/GetOrderInfo
    `http://10.35.10.82:5001/UI/Outbound/Order/GetOrderInfo?batch=${batch}&skip=${skip}`,
  // `http://10.35.10.82:7001/UI/Order/GetOrderInfo?batch=${batch}&skip=${skip}`, // 5001
  orderInfoPriority: '/Outbound/Order/UpdateOrderPriority', // 5001
  getRetrievload: '/Outbound/RetrieveLoad/GetRetrieveLoad', // 5001
  merger: '/Outbound/Order/CreateBatch', // 5001

  // 5004==========================================================
  retrieveLoadPriority: '/RetrieveLoad/Priority',
  // getInbound: '/Inbound/GetInbound',
  getInbound: (batch, skip) =>
    `http://10.35.10.82:5006/Inbound/UI/InboundPalletInfo/GetInboundPalletInfos?batch=${batch}&skip=${skip}`,
  getSKUMaster: 'http://10.35.10.82:7001/UI/SKU/GetSKUMaster', //7001
  getStockAdjust: 'http://10.35.10.82:5004/Inventory/UI/GetStockAdjustment',
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
