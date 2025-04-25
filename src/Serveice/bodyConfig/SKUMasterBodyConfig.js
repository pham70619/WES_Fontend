// export skumaster body
export const fetchData = (_date, product_id, owner_id, _status) => {
  return {
    timeFilter: {
      createTime: _date ? [`${_date}T00:00:00`, `${_date}T23:59:59`] : '',
    },
    basicInfo: {
      productID: product_id,
      ownerID: owner_id,
    },
    statusInfo: {
      status: _status,
    },
  }
}

const SKUMasterBody = {
  fetchData,
}

export default SKUMasterBody
