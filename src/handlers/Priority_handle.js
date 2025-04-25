export const PriorityFormatter = (selectedRows, priority) =>{
    if (!Array.isArray(selectedRows) || selectedRows.length === 0){
        return []
    }
    const groupedData = new Map()
    selectedRows.forEach((row) => {
        const key = `${row.customerID}_${row.warehouseID}_${row.zoneID}`

        if(!groupedData.has(key)){
            groupedData.set(key, {
                orders: [],
                priority: priority,
                customerID: row.customerID,
                warehouseID: row.warehouseID,
                zoneID: row.zoneID,
            })
        }
        groupedData.get(key).orders.push(row.customerOrderID)
    })
    return Array.from(groupedData.values())
}