// export inbound body
export const inboundBody = (_date, pallet_id, _status) => {
  return {
    timeFilter: {
      createTime: _date ? [`${_date}T00:00:00`, `${_date}T23:59:59`] : '',
    },
    basicInfo: {
      palletID: pallet_id,
    },
    statusInfo: {
      status: _status,
    },
  }
}

// export orderinfo body
export const orderInfoBody = (_date, store_id, customer_orderId, _status) => {
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
}

// export adjust priority body for orderinfo
export const updatePriorityBody = (_orders = [], _customerId, _warehouseId, _zoneId, _priority) => {
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
