export const generateBody = (componentName, inputs) => {
    const { inputContent, inputContent1, date, selectedOption } = inputs
    const body = {}

    const addTimeFilter = (key) => {
        if (date) {
            body.timeFilter = { [key]: [`${date}T00:00:00`, `${date}T23:59:59`] }
        }
    }

    const addBasicInfo = (fields) => {
        body.basicInfo = {}
        Object.entries(fields).forEach(([key, value]) => {
            if (value) body.basicInfo[key] = value
        })
    }

    const addStatusInfo = () => {
        if (selectedOption && selectedOption !== '全選') {
            body.statusInfo = { status: selectedOption }
        }
    }

    switch (componentName) {
        case 'Inbound':
            addTimeFilter('createTime')
            addBasicInfo({ palletID: inputContent })
            addStatusInfo()
            break

        case 'APILog':
            addTimeFilter('DespatchTime')
            addBasicInfo({ Service: selectedOption })
            break

        case 'OrderInfo':
            addTimeFilter('shippingTime')
            addBasicInfo({ storeID: inputContent, customerOrderID: inputContent1 })
            addStatusInfo()
            break

        case 'SKUMaster':
        case 'Retrieveload':
            addTimeFilter('createTime')
            addBasicInfo({ productID: inputContent, ownerID: inputContent1 })
            addStatusInfo()
            break

        default:
            console.warn(`⚠️ Warning: componentName "${componentName}" is not recognized.`);
            return { error: `Invalid component name: ${componentName}` }
    }
    return body
}