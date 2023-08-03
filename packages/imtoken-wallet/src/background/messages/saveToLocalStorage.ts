import * as Messaging from "@plasmohq/messaging"
import * as StorageHook from "@plasmohq/storage/hook"

import * as UtilsStorage from "~utils/storage"

export type RequestBody = {
  key: string
  rawValue: any
}

export type ResponseBody = {
  warning: any
}

const handler: Messaging.PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  // console.log(`[messaging][saveToStorage] Request: ${JSON.stringify(req)}`)

  const localStorage = UtilsStorage.getLocalStorage()

  // 寫入資料
  const warning = await localStorage.set(req.body.key, req.body.rawValue)

  // 讀取資料以確認已正確寫入
  console.log(
    `[messaging][saveToStorage] Stored key: ${
      req.body.key
    }, value: ${await localStorage.get(req.body.key)}`
  )

  res.send({
    warning: warning
  })
}

export default handler
