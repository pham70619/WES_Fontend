export const generateBody = (componentName, inputs) => {
  const { inputContent, inputContent1, date, selectedOption } = inputs

  switch (componentName) {
    // Inbound====================================================
    case 'Inbound': {
      const body = {}

      if (date) {
        body.timeFilter = {
          createTime: [`${date}T00:00:00`, `${date}T23:59:59`],
        }
      }

      if (inputContent) {
        body.basicInfo = {
          palletID: inputContent,
        }
      }
      if (selectedOption !== '全選') {
        body.statusInfo = {
          status: selectedOption,
        }
      }
      return body
    }

    // API log====================================================
    case 'APILog': {
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

      if (inputContent) {
        body.query.bool.must.push({
          match: {
            'metadata.LogRecord.ApiResponse.StatusCode': inputContent,
          },
        })
      }

      if (date) {
        body.query.bool.must.push({
          range: {
            'metadata.LogRecord.Timestamp': {
              gte: `${date}T00:00:00`,
              lte: `${date}T23:59:59`,
            },
          },
        })
      }

      if (selectedOption !== '全選') {
        body.query.bool.must.push({
          match: {
            'metadata.LogRecord.ServiceName': selectedOption,
          },
        })
      }

      return body
    }

    // Orderinfo==================================================
    case 'OrderInfo': {
      const body = {}

      if (date) {
        body.timeFilter = {
          shippingTime: [`${date}T00:00:00`, `${date}T23:59:59`],
        }
      }

      if (inputContent) {
        body.basicInfo = {
          storeID: inputContent,
        }
      }
      if (inputContent1) {
        body.basicInfo = {
          customerOrderID: inputContent1,
        }
      }
      if (inputContent && inputContent1) {
        body.basicInfo = {
          customerOrderID: inputContent1,
          StoreID: inputContent,
        }
      }
      if (selectedOption !== '全選') {
        body.statusInfo = {
          status: selectedOption,
        }
      }
      return body
    }

    // SKUMaster====================================================
    case 'SKUMaster': {
      const body = {}

      if (date) {
        body.timeFilter = {
          createTime: [`${date}T00:00:00`, `${date}T23:59:59`],
        }
      }

      if (inputContent) {
        body.basicInfo = {
          productID: inputContent,
        }
      }

      if (inputContent1) {
        body.basicInfo = {
          ownerID: inputContent1,
        }
      }

      if (inputContent && inputContent1) {
        body.basicInfo = {
          productID: inputContent,
          ownerID: inputContent1,
        }
      }

      if (selectedOption !== '全選') {
        body.StatusInfo = {
          status: selectedOption,
        }
      }
      return body
    }

    // retrieveload=================================================
    case 'Retrieveload': {
      const body = {}

      if (date) {
        body.timeFilter = {
          createTime: [`${date}T00:00:00`, `${date}T23:59:59`],
        }
      }

      if (inputContent) {
        body.basicInfo = {
          palletID: inputContent,
        }
      }

      if (inputContent1) {
        body.basicInfo = {
          loadID: inputContent1,
        }
      }

      if (inputContent && inputContent1) {
        body.basicInfo = {
          palletID: inputContent,
          loadID: inputContent1,
        }
      }

      if (selectedOption !== '全選') {
        body.StatusInfo = {
          status: selectedOption,
        }
      }

      return body
    }

    // stock adjustment ===============================================
    case 'StockAdjust': {
      const body = {}

      if (date) {
        body.timeFilter = {
          TimeStamp: [`${date}T00:00:00`, `${date}T23:59:59`],
        }
      }

      if (inputContent) {
        body.basicInfo = {
          palletID: inputContent,
        }
      }

      return body
    }
  }
}
