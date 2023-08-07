// 列舉所有 Messaging 用到的 Name
// 此值必須與 src/background/messages/ 裡的檔名一致
export enum MessagingName {
  generateMnemonic,
  validateMnemonic,
  saveToLocalStorage,
  loadFromLocalStorage,
  cryptoSubtle
}
