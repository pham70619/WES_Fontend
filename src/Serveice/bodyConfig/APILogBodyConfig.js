// get service name
export const getServiceName = () => {
  return {
    size: 0,
    aggs: {
      services: {
        terms: {
          field: 'metadata.LogRecord.ServiceName',
          size: 50,
        },
      },
    },
  }
}

// get status code
export const getStatusCode = () => {
  return {
    size: 0,
    aggs: {
      status_codes: {
        terms: {
          field: 'metadata.LogRecord.ApiResponse.StatusCode',
          size: 50,
        },
      },
    },
  }
}

// fetchData
export const fetchData = (_date, _service, _status) => {
  const body = {
    size: 2000,
    query: {
      bool: {
        must: [],
        should: [
          { exists: { field: 'metadata.LogRecord.ApiRequest.Method' } },
          { exists: { field: 'metadata.LogRecord.ApiRequest.Url' } },
          { exists: { field: 'metadata.LogRecord.ApiResponse.StatusCode' } },
          { exists: { field: 'metadata.LogRecord.ApiRequest.Body' } },
          { exists: { field: 'metadata.LogRecord.ApiResponse.Body' } },
        ],
        minimum_should_match: 1,
      },
    },
  }

  if (_date) {
    body.query.bool.must.push({
      range: {
        'metadata.LogRecord.Timestamp': {
          gte: `${_date}T00:00:00`,
          lte: `${_date}T23:59:59`,
        },
      },
    })
  }

  if (_service) {
    body.query.bool.must.push({
      match: {
        'metadata.LogRecord.ServiceName': _service,
      },
    })
  }

  if (_status) {
    body.query.bool.must.push({
      match: {
        'metadata.LogRecord.ApiResponse.StatusCode': _status,
      },
    })
  }

  return body
}

const APILogBody = {
  getServiceName,
  getStatusCode,
  fetchData,
}

export default APILogBody
