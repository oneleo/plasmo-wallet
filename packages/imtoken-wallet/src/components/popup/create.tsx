import * as React from "react"

import * as Messaging from "@plasmohq/messaging"

export const Create = () => {
  const [mnemonic, setMnemonic] = React.useState<string>("")
  const handlerGenerateMnemonic = async () => {
    const resp = await Messaging.sendToBackground({
      name: "generateMnemonic",
      body: {}
    })
    setMnemonic(resp.mnemonic)
  }
  return (
    <>
      <div>
        <span>mnemonic:</span>
        <span>{mnemonic}</span>
      </div>
      <div>
        <button
          className="plasmo-bg-blue-500 hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-bold plasmo-py-2 plasmo-px-4 plasmo-rounded"
          onClick={handlerGenerateMnemonic}>
          {chrome.i18n.getMessage("generate_mnemonic")}
        </button>
      </div>
    </>
  )
}
