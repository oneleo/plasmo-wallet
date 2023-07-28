import * as bip39 from "bip39"

import type { PlasmoMessaging } from "@plasmohq/messaging"

export type RequestBody = {}

export type ResponseBody = {
  mnemonic: string
}

const handler: PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  console.log(`request: ${JSON.stringify(req)}`)

  let mnemonic = bip39.generateMnemonic()
  res.send({
    mnemonic: mnemonic
  })
}

export default handler
