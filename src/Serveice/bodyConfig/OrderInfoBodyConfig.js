// export orderinfo body
export const fetchData = (_date, store_id, customer_orderId, _status) => {
  // const hasDate = _date && _date.trim() !== ''
  return {
    timeFilter: {
      shippingTime: _date ? [`${_date}T00:00:00`, `${_date}T23:59:59`] : '',
    },
    basicInfo: {
      storeID: store_id ?? '',
      customerOrderID: customer_orderId ?? '',
    },
    statusInfo: {
      status: _status,
    },
  }

  // const body = {}

  // if (_date && _date.trim() !== '') {
  //   body.timeFilter = {
  //     shippingTime: [`${_date}T00:00:00`, `${_date}T23:59:59`],
  //   }
  // }

  // const basicInfo = {}

  // if (store_id && store_id.trim() !== '') {
  //   basicInfo.storeID = store_id
  // }

  // if (customer_orderId && customer_orderId.trim() !== '') {
  //   basicInfo.customerOrderID = customer_orderId
  // }

  // if (Object.keys(basicInfo).length > 0) {
  //   body.basicInfo = basicInfo
  // }

  // if (_status && _status.trim() !== '') {
  //   body.statusInfo = {
  //     status: _status,
  //   }
  // }

  // return body
}

// submit OrderInfo body
export const submitData = (_orders = [], _customerId, _warehouseId, _zoneId) => {
  return {
    data: [
      {
        orders: _orders,
        customerID: _customerId,
        warehouseID: _warehouseId,
        zoneID: _zoneId,
      },
    ],
  }
}

// binding Orderinfo body
export const bindingData = (_orders = [], _toreId, _customerId, _warehouseId, _zoneId) => {
  return {
    data: [
      {
        orders: _orders,
        storeID: _toreId,
        customerID: _customerId,
        warehouseID: _warehouseId,
        zoneID: _zoneId,
      },
    ],
  }
}

// export adjust priority body for orderinfo
export const updatePriority = (_orders = [], _customerId, _warehouseId, _zoneId, _priority) => {
  return {
    data: [
      {
        orders: _orders,
        customerID: _customerId,
        warehouseID: _warehouseId,
        zoneID: _zoneId,
        priority: _priority,
      },
    ],
  }
}

const OrderInfoBody = {
  fetchData,
  submitData,
  bindingData,
  updatePriority,
}

export default OrderInfoBody
