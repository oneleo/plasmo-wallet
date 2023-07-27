import * as StorageUtils from "~utils/storage"
import { SecureStorageKey, StorageKey } from "~utils/storage"

const watchAndSetSecureStorage = async () => {
  const secureStorage = await StorageUtils.getSecureStorage()

  // 取得所有 SecureStorageKey 用到的 Key，並且逐一監聽（.watch）
  const secureStorageKeys = Object.keys(StorageUtils.SecureStorageKey)
  secureStorageKeys.forEach((key, idx) => {
    secureStorage.watch({
      [key]: (c) => {
        console.log(`${idx} ${key}: ${c}`)
      }
    })
  })
  // 取得所有 SecureStorageKey 用到的 Key，並且逐一設置預設值
  const secureStorageValues = Object.values(StorageUtils.SecureStorageKey)
  // 不要在 .forEach 中用 async/await，所以這邊使用 for value of
  for (const value of secureStorageValues) {
    switch (value) {
      case SecureStorageKey[SecureStorageKey.mnemonic]:
        await secureStorage.set(
          value,
          "test test test test test test test test test test test junk"
        )
        break
      default:
        break
    }
  }

  // The storage.set promise apparently resolves before the watch listener is registered...
  // So we need to wait a bit before adding the next watch if we want to split the watchers. Otherwise, the second watch will get the first set of change as well.
  await new Promise((resolve) => setTimeout(resolve, 470))
}

const watchAndSetStorage = async () => {
  const storage = StorageUtils.getStorage()

  // 取得所有 SecureStorageKey 用到的 Key，並且逐一監聽（.watch）
  const storageKeys = Object.keys(StorageUtils.StorageKey)
  storageKeys.forEach((key, idx) => {
    storage.watch({
      [key]: (c) => {
        console.log(`${idx} ${key}: ${c}`)
      }
    })
  })
  // 取得所有 SecureStorageKey 用到的 Key，並且逐一設置預設值
  const storageValues = Object.values(StorageUtils.StorageKey)
  // 不要在 .forEach 中用 async/await，所以這邊使用 for value of
  for (const value of storageValues) {
    switch (value) {
      case StorageKey[StorageKey.serialNumber]:
        await storage.set(value, "testSerial")
        break
      case StorageKey[StorageKey.openCount]:
        await storage.set(value, 0)
        break
      case StorageKey[StorageKey.checked]:
        await storage.set(value, false)
        break
      default:
        break
    }
  }

  // The storage.set promise apparently resolves before the watch listener is registered...
  // So we need to wait a bit before adding the next watch if we want to split the watchers. Otherwise, the second watch will get the first set of change as well.
  await new Promise((resolve) => setTimeout(resolve, 470))
}

const main = async () => {
  await watchAndSetSecureStorage()
  await watchAndSetStorage()
}

main()
export {}
console.log("HELLO WORLD FROM BGSCRIPTS")
