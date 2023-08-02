import * as PlasmoMessaging from "@plasmohq/messaging"

import * as StorageUtils from "~utils/storage"

export type RequestBody = {
  key: string
  rawValue: any
}

export type ResponseBody = {
  warning: Promise<any>
}

const handler: PlasmoMessaging.PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  console.log(`[messaging][saveToStorage] Request: ${JSON.stringify(req)}`)

  const localStorage = StorageUtils.getLocalStorage()

  res.send({
    warning: await localStorage.set(req.body.key, req.body.rawValue)
  })
}

export default handler
