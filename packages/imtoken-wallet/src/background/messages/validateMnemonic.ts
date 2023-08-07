import * as bip39 from "bip39"

import * as Messaging from "@plasmohq/messaging"

export type RequestBody = {
  mnemonic: string
}

export type ResponseBody = {
  success: boolean
}

const handler: Messaging.PlasmoMessaging.MessageHandler<
  RequestBody,
  ResponseBody
> = async (req, res) => {
  console.log(`[messaging][validateMnemonic] Request: ${JSON.stringify(req)}`)

  const validateMnemonic = bip39.validateMnemonic(
    req.body.mnemonic,
    bip39.wordlists.english
  )

  res.send({
    success: validateMnemonic
  })
}

export default handler
