// 本檔原始位置：background.ts
// 本檔會在 Chrome Extension 一執行載入至後臺
import * as Messaging from "@plasmohq/messaging"
import * as MessagingHook from "@plasmohq/messaging/hook"
import * as MessagingHub from "@plasmohq/messaging/pub-sub"

import { MessagingName } from "~utils/messaging"
import { PortName } from "~utils/port"
import * as UtilsStorage from "~utils/storage"
import { SecureStorageKey, StorageKey } from "~utils/storage"

const main = async () => {
  console.log(`[background] Detect browser: ${process.env.PLASMO_BROWSER}`)

  // 當 Popup 被關閉時，保存目前時間
  await popupClosed()

  // 註冊所有 Plasmo Storage 的 StorageKey 與 SecureStorageKey 事件
  await watchAndSetSecureStorage()
  await watchAndSetStorage()

  // 複製自 with-messaging 範例，作用不明
  // 來源：https://github.com/PlasmoHQ/examples/blob/main/with-messaging/background/index.ts
  MessagingHub.startHub()
}

const popupClosed = async () => {
  chrome.runtime.onConnect.addListener(async (port) => {
    // 監聽來自於 popup.ts 來的 "popup" port 連線
    if (port.name == PortName[PortName.popup]) {
      port.onDisconnect.addListener(async () => {
        // 無法在 background.ts 中使用 Messaging，錯誤訊息：
        // Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist. Promise.then (async) (anonymous)

        // Messaging.sendToBackground({
        //   name: MessagingKey[MessagingKey.saveToLocalStorage],
        //   body: {
        //     key: StorageKey[StorageKey.closedTime],
        //     rawValue: new Date().getTime()
        //   }
        // }).then((resp) => {
        //   console.log(`resp: ${JSON.stringify(resp, null, 2)}`)
        // })

        // 當 Popup 被關閉時，保存目前時間
        const localStorage = UtilsStorage.getLocalStorage()
        // 寫入資料
        const warning = await localStorage.set(
          StorageKey[StorageKey.lastClosedTime],
          new Date().getTime()
        )

        // 讀取資料以確認已正確寫入
        console.log(
          `[port][storage] Stored key: ${
            StorageKey[StorageKey.lastClosedTime]
          }, value = ${await localStorage.get(
            StorageKey[StorageKey.lastClosedTime]
          )}`
        )

        console.log(`[background] popup has been closed`)
      })
    }
  })
}

const watchAndSetSecureStorage = async () => {
  const secureStorage = await UtilsStorage.getSecureStorage()

  // 遍歷 StorageUtils.SecureStorageKey 所有 key 與 value 值，但只篩出 key 值
  const secureStorageKeys = Object.keys(UtilsStorage.SecureStorageKey).filter(
    (k) => isNaN(Number(k))
  )

  // 註：不要在 .forEach 中用 async/await，所以這邊使用 for value of
  for (const key of secureStorageKeys) {
    console.log(`[background][storage] Watching secure key: ${key}`)
    // 取得所有 SecureStorageKey 用到的 Key，並且逐一監聽（.watch）
    secureStorage.watch({
      [key]: (c) => {
        console.log(
          `[background][storage] Stored key: ${key}, value: ${JSON.stringify(
            c
          )}`
        )
      }
    })
    // 取得所有 SecureStorageKey 用到的 Key，並且逐一設置預設值
    switch (key) {
      case SecureStorageKey[SecureStorageKey.mnemonic]:
        console.log(
          `[storage] Storing key: ${key}, warning: ${await secureStorage.set(
            key,
            "test test test test test test test test test test test junk"
          )}`
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
  const localStorage = UtilsStorage.getLocalStorage()

  // 遍歷 StorageUtils.SecureStorageKey 所有 key 與 value 值，但只篩出 key 值

  const storageKeys = Object.keys(UtilsStorage.StorageKey).filter((k) =>
    isNaN(Number(k))
  )

  // 註：不要在 .forEach 中用 async/await，所以這邊使用 for value of
  for (const key of storageKeys) {
    console.log(`[background][storage] Watching local key: ${key}`)
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
          `[storage] Storing key: ${key}, warning: ${await localStorage.set(
            key,
            "testSerial"
          )}`
        )
        break
      case StorageKey[StorageKey.openCount]:
        console.log(
          `[storage] Storing key: ${key}, warning: ${await localStorage.set(
            key,
            0
          )}`
        )
        break
      case StorageKey[StorageKey.checked]:
        console.log(
          `[storage] Storing key: ${key}, warning: ${await localStorage.set(
            key,
            false
          )}`
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
