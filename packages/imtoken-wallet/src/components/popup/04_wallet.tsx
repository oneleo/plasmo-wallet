import * as React from "react"
import * as Wouter from "wouter"

import * as Messaging from "@plasmohq/messaging"

import { LocaleName } from "~utils/locale"
import { MessagingName } from "~utils/messaging"
import { RoutePath } from "~utils/router"
import { StorageKey } from "~utils/storage"

export const Wallet: React.FunctionComponent = () => {
  const [location, setLocation] = Wouter.useLocation()
  const [error, setError] = React.useState<string>()

  React.useEffect(() => {
    const asyncFunc = async () => {
      await handlerComponentDidMount()
    }
    asyncFunc()
  }, [])

  const handlerComponentDidMount = React.useCallback(async () => {
    // 透過 localStorage 提取密碼
    const password = atob(
      (
        await Messaging.sendToBackground({
          name: MessagingName[
            MessagingName.loadFromLocalStorage
          ] as keyof Messaging.MessagesMetadata,
          body: {
            key: StorageKey[StorageKey.password]
          }
        })
      ).value
    )

    // 透過 Messaging 將加密後的助記詞從 LocalStorage 中讀取出來
    const walletFromLocalStorage = (
      await Messaging.sendToBackground({
        name: MessagingName[
          MessagingName.loadFromLocalStorage
        ] as keyof Messaging.MessagesMetadata,
        body: {
          key: StorageKey[StorageKey.wallet]
        }
      })
    ).value

    // 使用密碼解密助記詞
    const decoding = (
      await Messaging.sendToBackground({
        name: MessagingName[
          MessagingName.cryptoSubtle
        ] as keyof Messaging.MessagesMetadata,
        body: {
          password: password,
          data: walletFromLocalStorage[0],
          keyUsages: "decrypt"
        }
      })
    ).data

    setError(`decoding: ${decoding}`)
    // 跳轉至儲存建立助記詞頁面
    // setLocation(RoutePath.create)
  }, [])

  const handlerButtonOnClick = React.useCallback(async () => {
    // setLocation(RoutePath.store)
  }, [])

  return (
    <>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <button
          className="plasmo-order-2 plasmo-text-base plasmo-bg-blue-500 hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-bold plasmo-py-2 plasmo-px-4 plasmo-rounded"
          onClick={handlerButtonOnClick}>
          {chrome.i18n.getMessage(LocaleName[LocaleName.extensionName])}
        </button>
      </div>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <span className="plasmo-order-3 plasmo-text-red-500 plasmo-font-bold plasmo-text-base plasmo-py-3 plasmo-px-3">
          {error ? error : null}
        </span>
      </div>
    </>
  )
}
