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

  bip39.setDefaultWordlist("english")

  const mnemonic = bip39.generateMnemonic(128) // 128 bits = 12 words, 256 bits = 24 words

  res.send({
    mnemonic: mnemonic
  })
}

export default handler
