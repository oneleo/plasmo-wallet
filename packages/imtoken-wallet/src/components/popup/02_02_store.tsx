import * as React from "react"
import * as Wouter from "wouter"

import * as Messaging from "@plasmohq/messaging"

import * as ContextPassword from "~components/context/password"
import { MessagingName } from "~utils/messaging"
import { RoutePath } from "~utils/router"
import { StorageKey } from "~utils/storage"

export const Store: React.FunctionComponent = () => {
  const [location, setLocation] = Wouter.useLocation()

  const contextPassword = React.useContext(ContextPassword.Context)

  React.useEffect(() => {
    const asyncFunc = async () => {
      await handlerLoad()
    }
    asyncFunc()
  }, [])

  const handlerLoad = React.useCallback(async () => {
    // 透過 Messaging 將密碼存入 LocalStorage 中
    const warning = (
      await Messaging.sendToBackground({
        name: MessagingName[
          MessagingName.saveToLocalStorage
        ] as keyof Messaging.MessagesMetadata,
        body: {
          key: StorageKey[StorageKey.password],
          rawValue: btoa(contextPassword.password)
        }
      })
    ).warning

    console.log(`warning: ${warning}`)

    // ---------------------
    // -- 測試區 --
    // -- 這邊假裝已建立錢包 --
    // ---------------------
    await Messaging.sendToBackground({
      name: MessagingName[
        MessagingName.saveToLocalStorage
      ] as keyof Messaging.MessagesMetadata,
      body: {
        key: StorageKey[StorageKey.hasWallet],
        rawValue: true
      }
    })

    // 跳轉至儲存建立助記詞頁面
    setLocation(RoutePath.create)
  }, [contextPassword.password])

  return <></>
}
