import * as Messaging from "@plasmohq/messaging"
import * as StorageHook from "@plasmohq/storage/hook"

import * as UtilsStorage from "~utils/storage"

export type RequestBody = {
  key: string
}

export type ResponseBody = {
  value: any
}

const handler: Messaging.PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  // console.log(`[messaging][saveToStorage] Request: ${JSON.stringify(req)}`)

  const localStorage = UtilsStorage.getLocalStorage()

  // 讀取資料
  const value = await localStorage.get(req.body.key)

  res.send({
    value: value
  })
}

export default handler
