import * as React from "react"
import * as Wouter from "wouter"

import * as Messaging from "@plasmohq/messaging"

import { MessagingName } from "~utils/messaging"
import { RoutePath } from "~utils/router"
import { StorageKey } from "~utils/storage"

export const Clear: React.FunctionComponent = () => {
  React.useEffect(() => {
    const asyncFunc = async () => {
      await handlerLoad()
    }

    asyncFunc()
  }, [])

  const handlerLoad = React.useCallback(async () => {
    // 遍歷 StorageUtils.SecureStorageKey 所有 key 與 value 值，但只篩出 key 值
    const storageKeys = Object.keys(StorageKey).filter((k) => isNaN(Number(k)))

    // 將所有值清為 undefined
    for (const key of storageKeys) {
      await Messaging.sendToBackground({
        name: MessagingName[
          MessagingName.saveToLocalStorage
        ] as keyof Messaging.MessagesMetadata,
        body: {
          key: key,
          rawValue: null
        }
      })
      console.log(`clear: ${key}`)
    }
  }, [])

  return <></>
}
