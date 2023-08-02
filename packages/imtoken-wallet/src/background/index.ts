// 本檔原始位置：background.ts
import { startHub } from "@plasmohq/messaging/pub-sub"

import * as StorageUtils from "~utils/storage"
import { SecureStorageKey, StorageKey } from "~utils/storage"

const main = async () => {
  console.log(`[browser] ${process.env.PLASMO_BROWSER}`)
  await watchAndSetSecureStorage()
  await watchAndSetStorage()
  startHub()
}

const watchAndSetSecureStorage = async () => {
  const secureStorage = await StorageUtils.getSecureStorage()

  // 遍歷 StorageUtils.SecureStorageKey 所有 key 與 value 值，但只篩出 key 值
  const secureStorageKeys = Object.keys(StorageUtils.SecureStorageKey).filter(
    (k) => isNaN(Number(k))
  )

  // 註：不要在 .forEach 中用 async/await，所以這邊使用 for value of
  for (const key of secureStorageKeys) {
    console.log(`[background] Watching secure storage key: ${key}`)
    // 取得所有 SecureStorageKey 用到的 Key，並且逐一監聽（.watch）
    secureStorage.watch({
      [key]: (c) => {
        console.log(`${key}: ${JSON.stringify(c)}`)
      }
    })
    // 取得所有 SecureStorageKey 用到的 Key，並且逐一設置預設值
    switch (key) {
      case SecureStorageKey[SecureStorageKey.mnemonic]:
        await secureStorage.set(
          key,
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
  const localStorage = StorageUtils.getLocalStorage()

  // 遍歷 StorageUtils.SecureStorageKey 所有 key 與 value 值，但只篩出 key 值

  const storageKeys = Object.keys(StorageUtils.StorageKey).filter((k) =>
    isNaN(Number(k))
  )

  // 註：不要在 .forEach 中用 async/await，所以這邊使用 for value of
  for (const key of storageKeys) {
    console.log(`[background] Watching storage key: ${key}`)
    // 取得所有 SecureStorageKey 用到的 Key，並且逐一監聽（.watch）
    localStorage.watch({
      [key]: (c) => {
        console.log(`${key}: ${JSON.stringify(c)}`)
      }
    })
    // 取得所有 SecureStorageKey 用到的 Key，並且逐一設置預設值
    switch (key) {
      case StorageKey[StorageKey.serialNumber]:
        console.log(
          `[storage] Capacity warning: ${await localStorage.set(
            key,
            "testSerial"
          )}`
        )
        break
      case StorageKey[StorageKey.openCount]:
        console.log(
          `[storage] Capacity warning: ${await localStorage.set(key, 0)}`
        )
        break
      case StorageKey[StorageKey.checked]:
        console.log(
          `[storage] Capacity warning: ${await localStorage.set(key, false)}`
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

main()
export {}
console.log("HELLO WORLD FROM BGSCRIPTS")
