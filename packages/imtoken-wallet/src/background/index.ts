// 本檔原始位置：background.ts
// 本檔會在 Chrome Extension 一執行載入至後臺
// Background 的 Lifecycle 參考：https://developer.chrome.com/docs/extensions/mv3/service_workers/service-worker-lifecycle/
// 注意：Background Event = Extension Service Worker Event > Extension Event = chrome.runtime API
// Background Event 參考：https://developer.chrome.com/docs/extensions/mv3/service_workers/events/
// Extension Event 參考：https://developer.chrome.com/docs/extensions/reference/runtime/

import * as IconUrlNotifications from "url:assets/icon.png"

import * as Messaging from "@plasmohq/messaging"
import * as MessagingHook from "@plasmohq/messaging/hook"
import * as MessagingHub from "@plasmohq/messaging/pub-sub"

import { MessagingName } from "~utils/messaging"
import { PortName } from "~utils/port"
import * as UtilsStorage from "~utils/storage"
import { SecureStorageKey, StorageKey } from "~utils/storage"

// 目前已了解 Plasmo Storage、Messaging、
// 目前還在研究 Wouter、Context
// 還尚需要知道 Port 長久連接監聽、Window 事件訂閱
// 打算透過實作的方式來掌握 Plasmo Storage、Messaging 功能

const main = async () => {
  console.log(`[background] Detect browser: ${process.env.PLASMO_BROWSER}`)

  // 監聽所有 Port 連線，並設置對應的處理方式
  await portHandlers()

  // 註冊所有 Plasmo Storage 的 StorageKey 與 SecureStorageKey 事件
  await watchAndSetSecureStorage()
  await watchAndSetStorage()

  // 複製自 with-messaging 範例，作用不明
  // 來源：https://github.com/PlasmoHQ/examples/blob/main/with-messaging/background/index.ts
  MessagingHub.startHub()
}

const portHandlers = async () => {
  // 一次性連接：Messaging：chrome.runtime.onConnect：
  // https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
  // 不間斷連接：Port：chrome.runtime.onMessage：
  // https://developer.chrome.com/docs/extensions/mv3/messaging/#connect

  const richNotifications = (title: string, message: string) => {
    // 註：使用 Rich Notifications API 需開啟 Chrome 及 MacOS/Windows 通知權限
    chrome.notifications.create({
      type: "basic",
      iconUrl: IconUrlNotifications.default,
      title: `${title}`,
      message: `${message}`
    })
  }

  // 羅列所有 Port 的長期連線，以及事件的處理方式
  const handlerPortsConnect = async (port: chrome.runtime.Port) => {
    switch (port.name) {
      // 來自於 popup.ts 來的 "popup" port 連線
      case PortName[PortName.popup]:
        port.onDisconnect.addListener(handlerPopupClosed) // 當 Port 斷連時的處理方式
        break
      default:
        break
    }

    // 因無法為 port 設立 port.xxx.removeListener 所以設置 null 讓 GC 自動回收
    // port.onDisconnect.removeListener(handlerPopupClosed)
    port = null
  }

  const handlerPopupClosed = async () => {
    // 當 Popup 被關閉時，保存目前時間
    const localStorage = UtilsStorage.getLocalStorage()
    // 寫入時間資料
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
    console.log(`[background] Popup has been closed`)
    richNotifications("background", "Popup has been closed")
    // 註：因為 Port 也算是 Messaging 的一種，所以不要和 Messaging 形成巢狀監聽
    // 參考：https://developer.chrome.com/docs/extensions/mv3/service_workers/events/#declare-events
  }

  // 監聽所有 Port 的長期連線
  chrome.runtime.onConnect.addListener(handlerPortsConnect)

  // 當關閉 Background 時，移除所有監聽以避免記憶體洩漏
  // 註：這邊應無法觸發到，要再想其他方法
  chrome.runtime.onSuspend.addListener(async () => {
    // 移除監聽所有 Port 的長期連線
    chrome.runtime.onConnect.removeListener(handlerPortsConnect)
    console.log(`[background] Background has been closed`)
    richNotifications("background", "Background has been closed")
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
