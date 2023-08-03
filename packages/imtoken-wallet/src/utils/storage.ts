import * as Storage from "@plasmohq/storage"
import * as SecureStorage from "@plasmohq/storage/secure"

// 獲取安全的存儲模塊配置。這將防止錢包洩露到 window.localStorage
export interface StorageConfig {
  area?: "local" | "sync" | "managed" | "session"
  allSecret?: boolean
  copiedKeyList?: string[]
}

// 列舉所有 Storage 用到的 Key
export enum StorageKey {
  serialNumber,
  openCount,
  checked,
  password,
  lastClosedTime,
  hasWallet,
  test
}

// 列舉所有 SecureStorageKey 用到的 Key
export enum SecureStorageKey {
  mnemonic
}

// 取得本地儲存空間，其值不會復製到 window.localStorage
export const getLocalStorage = () => {
  const storageConfig: StorageConfig = {
    area: "local"
  }
  return new Storage.Storage(storageConfig)
}

// 取得臨時儲存空間
export const getTempStorage = () => {
  const storageConfig: StorageConfig = {
    area: "session"
  }
  return new Storage.Storage(storageConfig)
}

// 取得本地帶有密碼的儲存空間
export const getSecureStorage = async () => {
  const storageConfig: StorageConfig = {
    area: "local"
  }
  const secureStorage = new SecureStorage.SecureStorage(storageConfig)
  await secureStorage.setPassword(process.env.PLASMO_PUBLIC_STORAGE_PASSWORD)
  return secureStorage
}
