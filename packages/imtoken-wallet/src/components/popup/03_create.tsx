import * as React from "react"

import * as Messaging from "@plasmohq/messaging"

import * as ContextPassword from "~components/context/password"
import { MessagingName } from "~utils/messaging"
import { RoutePath } from "~utils/router"

export const Create: React.FunctionComponent = () => {
  const [mnemonic, setMnemonic] = React.useState<string>("")
  const contextPassword = React.useContext(ContextPassword.Context)

  React.useEffect(() => {
    console.log(`contextPassword: ${contextPassword.password}`)
  }, [])

  const handlerGenerateMnemonic = async () => {
    const resp = await Messaging.sendToBackground({
      name: MessagingName[
        MessagingName.generateMnemonic
      ] as keyof Messaging.MessagesMetadata,
      body: {}
    })
    setMnemonic(resp.mnemonic)
  }

  const handlerTest = async () => {
    const password = "p@ssw0rd"
    const resp = await Messaging.sendToBackground({
      name: MessagingName[
        MessagingName.saveToLocalStorage
      ] as keyof Messaging.MessagesMetadata,
      body: { key: "password", rawValue: btoa(password) }
    })
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
        <button
          className="plasmo-bg-blue-500 hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-bold plasmo-py-2 plasmo-px-4 plasmo-rounded"
          onClick={handlerTest}>
          button2
        </button>
      </div>
    </>
  )
}
