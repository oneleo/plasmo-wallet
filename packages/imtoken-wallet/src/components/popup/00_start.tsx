import * as React from "react"
import * as Wouter from "wouter"

import * as Messaging from "@plasmohq/messaging"

import { MessagingName } from "~utils/messaging"
import { RoutePath } from "~utils/router"
import { StorageKey } from "~utils/storage"

export const Start: React.FunctionComponent = () => {
  const [location, setLocation] = Wouter.useLocation()

  React.useEffect(() => {
    const asyncFunc = async () => {
      await handlerLoad()
    }

    asyncFunc()
  }, [])

  const handlerLoad = React.useCallback(async () => {
    const lastClosedTimeAddOneHour = new Date(
      (
        await Messaging.sendToBackground({
          name: MessagingName[
            MessagingName.loadFromLocalStorage
          ] as keyof Messaging.MessagesMetadata,
          body: {
            key: StorageKey[StorageKey.lastClosedTime]
          }
        })
      ).value +
        60 * 60 * 1000
    )

    const hasWallet = (
      await Messaging.sendToBackground({
        name: MessagingName[
          MessagingName.loadFromLocalStorage
        ] as keyof Messaging.MessagesMetadata,
        body: {
          key: StorageKey[StorageKey.hasWallet]
        }
      })
    ).value

    // 如果超過 1 小時沒有開啟錢包，則進到輸入密碼頁面
    console.log(`lastClosedTime: ${lastClosedTimeAddOneHour}`)
    if (new Date().getTime() > lastClosedTimeAddOneHour.getTime()) {
      console.log(`已超過 1 小時沒有開啟錢包`)
    }

    // 若已經有錢包，則跳轉至 AA 錢包儀表板
    console.log(`hasWallet: ${hasWallet}`)
    if (hasWallet) {
      setLocation(RoutePath.create)
    }

    // 若沒有錢包，則跳轉至儲存建立助記詞頁面
    if (!hasWallet) {
      setLocation(RoutePath.welcome)
    }
  }, [])

  return <></>
}
