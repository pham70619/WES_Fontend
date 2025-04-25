export const DespathFormatter = (selectedRows) => {
    if (!Array.isArray(selectedRows) || selectedRows.length === 0) {
        return []
    }

    const groupedData = new Map()
    selectedRows.forEach((row) => {
        const key = `${row.customerID}_${row.warehouseID}_${row.zoneID}`

        if (!groupedData.has(key)) {
            groupedData.set(key, {
                orders: [],
                customerID: row.customerID,
                warehouseID: row.warehouseID,
                zoneID: row.zoneID,
            })
        }
        groupedData.get(key).orders.push(row.customerOrderID)
    })
    return Array.from(groupedData.values())
}