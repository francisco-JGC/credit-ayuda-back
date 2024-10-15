export function generatePurchaseCode(purchaseId: number) {
  const idPart = purchaseId.toString().padStart(4, '0')

  const today = new Date()
  const month = (today.getMonth() + 1).toString().padStart(2, '0')
  const day = today.getDate().toString().padStart(2, '0')
  const year = today.getFullYear().toString().slice(-2)

  const purchaseCode = `INV${idPart}-${month}-${day}-${year}`

  return purchaseCode
}
