import * as bip39 from "bip39"

import * as Messaging from "@plasmohq/messaging"

export type RequestBody = {}

export type ResponseBody = {
  mnemonic: string
}

const handler: Messaging.PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  console.log(`[messaging][generateMnemonic] Request: ${JSON.stringify(req)}`)

  let mnemonic = bip39.generateMnemonic()
  res.send({
    mnemonic: mnemonic
  })
}

export default handler
