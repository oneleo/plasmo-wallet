import * as React from "react"
import * as Wouter from "wouter"

import * as Messaging from "@plasmohq/messaging"

import * as ContextPassword from "~components/context/password"
import { LocaleName } from "~utils/locale"
import { MessagingName } from "~utils/messaging"
import { RoutePath } from "~utils/router"
import { StorageKey } from "~utils/storage"

export const Create: React.FunctionComponent = () => {
  const [location, setLocation] = Wouter.useLocation()
  const [mnemonic, setMnemonic] = React.useState<string>("")
  const [error, setError] = React.useState<string>("")
  const [doubleCheckReplace, setDoubleCheckReplace] =
    React.useState<boolean>(false)

  const contextPassword = React.useContext(ContextPassword.Context)

  React.useEffect(() => {
    console.log(`contextPassword: ${contextPassword.password}`)
  }, [])

  const handlerGenerateMnemonic = React.useCallback(async () => {
    // 如果沒有輸入任何助記詞，就直接產生一組
    if (!mnemonic) {
      setError("")
      setDoubleCheckReplace(false)
      const resp = await Messaging.sendToBackground({
        name: MessagingName[
          MessagingName.generateMnemonic
        ] as keyof Messaging.MessagesMetadata,
        body: {}
      })
      setMnemonic(resp.mnemonic)
      return
    }

    // 如果有輸入助記詞，且尚未確認是否可覆寫，則提示錯誤
    if (mnemonic && !doubleCheckReplace) {
      setError(chrome.i18n.getMessage(LocaleName[LocaleName.replaceMnemonic]))
      setDoubleCheckReplace(true)
      return
    }

    // 確認是可以覆寫，覆蓋並產生新的助記詞
    if (doubleCheckReplace) {
      setError("")
      setDoubleCheckReplace(false)
      const resp = await Messaging.sendToBackground({
        name: MessagingName[
          MessagingName.generateMnemonic
        ] as keyof Messaging.MessagesMetadata,
        body: {}
      })
      setMnemonic(resp.mnemonic)
      return
    }
    console.log(`generateMnemonic`)
  }, [mnemonic, doubleCheckReplace])

  const handlerValidateMnemonic = React.useCallback(async () => {
    const validateMnemonic = await Messaging.sendToBackground({
      name: MessagingName[
        MessagingName.validateMnemonic
      ] as keyof Messaging.MessagesMetadata,
      body: { mnemonic: mnemonic }
    })

    if (!validateMnemonic.success) {
      setError(chrome.i18n.getMessage(LocaleName[LocaleName.errorMnemonic]))
      return
    }

    if (validateMnemonic.success) {
      // 透過 Context 提取密碼
      // const password = contextPassword.password

      // 透過 localStorage 提取密碼
      const password = atob(
        (
          await Messaging.sendToBackground({
            name: MessagingName[
              MessagingName.loadFromLocalStorage
            ] as keyof Messaging.MessagesMetadata,
            body: {
              key: StorageKey[StorageKey.password]
            }
          })
        ).value
      )

      // const initializationVector = new Uint8Array([
      //   3, 3, 3, 3, 6, 6, 6, 6, 9, 9, 9, 9
      // ])
      // const salt = new Uint8Array([
      //   3, 3, 3, 3, 6, 6, 6, 6, 9, 9, 9, 9, 12, 12, 12, 12
      // ])
      // const initializationVector = crypto.getRandomValues(new Uint8Array(12))
      // const salt = crypto.getRandomValues(new Uint8Array(16))

      // 使用密碼加密助記詞
      const wallet = [
        (
          await Messaging.sendToBackground({
            name: MessagingName[
              MessagingName.cryptoSubtle
            ] as keyof Messaging.MessagesMetadata,
            body: {
              password: password,
              data: mnemonic,
              keyUsages: "encrypt"
            }
          })
        ).data
      ]

      console.log(`wallet: ${wallet[0]}`)

      // 透過 Messaging 將加密後的助記詞存入 LocalStorage 中
      const warning = (
        await Messaging.sendToBackground({
          name: MessagingName[
            MessagingName.saveToLocalStorage
          ] as keyof Messaging.MessagesMetadata,
          body: {
            key: StorageKey[StorageKey.wallet],
            rawValue: wallet
          }
        })
      ).warning

      if (warning) {
        setError(
          `${chrome.i18n.getMessage(
            LocaleName[LocaleName.errorMessage]
          )} ${warning}`
        )
        return
      }

      // 透過 Messaging 將加密後的助記詞從 LocalStorage 中讀取出來
      const walletFromLocalStorage = (
        await Messaging.sendToBackground({
          name: MessagingName[
            MessagingName.loadFromLocalStorage
          ] as keyof Messaging.MessagesMetadata,
          body: {
            key: StorageKey[StorageKey.wallet]
          }
        })
      ).value

      // 使用密碼解密助記詞
      const decoding = (
        await Messaging.sendToBackground({
          name: MessagingName[
            MessagingName.cryptoSubtle
          ] as keyof Messaging.MessagesMetadata,
          body: {
            password: password,
            data: walletFromLocalStorage[0],
            keyUsages: "decrypt"
          }
        })
      ).data

      console.log(`decoding: ${decoding}`)

      setLocation(RoutePath.wallet)
    }
  }, [mnemonic])

  const handlerInputOnChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setMnemonic(value)
      setError("")
      setDoubleCheckReplace(false)
    },
    []
  )

  return (
    <>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-center plasmo-content-center plasmo-flex-no-wrap">
        <span className="plasmo-order-1 plasmo-flex-initial plasmo-w-1/4 plasmo-m-auto plasmo-p-3 plasmo-text-blue-500 plasmo-font-bold plasmo-text-base ">
          mnemonic:
        </span>
        <input
          type="text"
          id="mnemonic"
          placeholder="test test test test test test test test test test test junk"
          onChange={handlerInputOnChange}
          value={mnemonic}
          className="plasmo-order-2 plasmo-flex-initial plasmo-w-3/4 plasmo-m-auto plasmo-p-3  plasmo-text-base plasmo-rounded-lg plasmo-border plasmo-border-gray-300 focus:plasmo-ring-blue-500"
        />
      </div>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <button
          className="plasmo-order-1 plasmo-text-base plasmo-bg-blue-500 hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-bold plasmo-py-2 plasmo-px-4 plasmo-rounded"
          onClick={handlerGenerateMnemonic}>
          {chrome.i18n.getMessage(LocaleName[LocaleName.generate_mnemonic])}
        </button>
        <button
          className="plasmo-order-2 plasmo-text-base plasmo-bg-blue-500 hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-bold plasmo-py-2 plasmo-px-4 plasmo-rounded"
          onClick={handlerValidateMnemonic}>
          {chrome.i18n.getMessage(LocaleName[LocaleName.check_and_next])}
        </button>
      </div>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <span className="plasmo-order-3 plasmo-text-red-500 plasmo-font-bold plasmo-text-base plasmo-py-3 plasmo-px-3">
          {error ? error : null}
        </span>
      </div>
    </>
  )
}
