// fetch data body
export const fetchData = (_date, pallet_id, load_id, _status) => {
  return {
    timeFilter: {
      createTime: _date ? [`${_date}T00:00:00`, `${_date}T23:59:59`] : '',
    },
    basicInfo: {
      palletID: pallet_id,
      loadID: load_id,
    },
    statusInfo: {
      status: _status,
    },
  }
}
// update priority body
export const updatePriority = () => {
  return {}
}

const RetrieveLoadBody = {
  fetchData,
  updatePriority,
}

export default RetrieveLoadBody
