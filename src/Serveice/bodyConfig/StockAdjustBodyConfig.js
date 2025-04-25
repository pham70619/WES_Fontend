// export stock adjustment body
export const fetchData = (_date, pallet_id) => {
  return {
    timeFilter: {
      timeStamp: _date ? [`${_date}T00:00:00`, `${_date}T23:59:59`] : [],
    },
    basicInfo: {
      palletID: pallet_id,
    },
  }
}

const StockAdjustBody = {
  fetchData,
}

export default StockAdjustBody
