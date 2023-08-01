import * as React from "react"
import * as Wouter from "wouter"

import * as Messaging from "@plasmohq/messaging"
import * as StorageHook from "@plasmohq/storage/hook"

import * as SecureStorage from "~components/context/secureStorage"
import * as PopupCreate from "~components/popup/create"
import * as UtilsWagmi from "~components/popup/wagmi"
import * as PopupHome from "~components/popup/welcome"
import * as UtilsRouter from "~utils/router"
import * as UtilsStorage from "~utils/storage"
import { StorageKey } from "~utils/storage"

import "~style.css"

function IndexPopup() {
  const storage = UtilsStorage.getStorage()

  const [data, setData] = React.useState("")
  const [count, increase] = React.useReducer((c) => c + 1, 0)
  const [mnemonic, setMnemonic] = React.useState<string>("")

  const [openCount, setOpenCount] = StorageHook.useStorage<number>(
    { key: StorageKey[StorageKey.openCount], instance: storage },
    (s) => (typeof s === "undefined" ? 0 : s)
  )
  const [checked, setChecked] = StorageHook.useStorage<boolean>(
    { key: StorageKey[StorageKey.checked], instance: storage },
    (s) => (typeof s === "undefined" ? false : s)
  )

  const [serialNumber, setSerialNumber] = StorageHook.useStorage<string>(
    {
      key: StorageKey[StorageKey.serialNumber],
      instance: storage
    },
    (s) => (typeof s === "undefined" ? "" : s)
  )

  return (
    <>
      {/* <UtilsWagmi.initWagmi /> */}
      <Wouter.Router hook={UtilsRouter.useHashLocation}>
        <Wouter.Route path="/" component={PopupHome.Welcome} />
        <Wouter.Route path="/create" component={PopupCreate.Create} />
      </Wouter.Router>
      <div className="plasmo-bg-gray-300 plasmo-w-full plasmo-h-full">
        <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-50 plasmo-w-50">
          <button
            onClick={async () => {
              const resp = await Messaging.sendToBackground({
                name: "generateMnemonic",
                body: {}
              })
              setMnemonic(resp.mnemonic)
            }}>
            Hash TX
          </button>
          <span className="plasmo-text-9xl plasmo-font-bold plasmo-mb-2 plasmo-text-yellow-500">
            {mnemonic}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 16
          }}>
          <h1>
            Welcome to your <a href="https://www.plasmo.com">Plasmo</a>{" "}
            Extension!
          </h1>
          <input onChange={(e) => setData(e.target.value)} value={data} />
          <footer>Crafted by @PlamoHQ</footer>
        </div>
        <div>
          <input
            onChange={(e) => setSerialNumber(e.target.value)}
            value={serialNumber}
          />
          <input
            type={"checkbox"}
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        </div>
        <div>
          <button
            onClick={() => increase()}
            type="button"
            className="plasmo-flex plasmo-flex-row plasmo-items-center plasmo-px-4 plasmo-py-2 plasmo-text-sm plasmo-rounded-lg plasmo-transition-all plasmo-border-none
      plasmo-shadow-lg hover:plasmo-shadow-md
      active:plasmo-scale-105 plasmo-bg-slate-50 hover:plasmo-bg-slate-100 plasmo-text-slate-800 hover:plasmo-text-slate-900">
            Count:
            <span className="plasmo-inline-flex plasmo-items-center plasmo-justify-center plasmo-w-8 plasmo-h-4 plasmo-ml-2 plasmo-text-xs plasmo-font-semibold plasmo-rounded-full">
              {count}
            </span>
          </button>
        </div>
        <SecureStorage.ContextProvider>
          <Child />
        </SecureStorage.ContextProvider>
      </div>
    </>
  )
}

const Child = () => {
  const secureStorage = SecureStorage.useSecureStorage()
  const [
    mnemonic,
    setMnemonic,
    {
      setRenderValue: setMnemonicRender,
      setStoreValue: setMnemonicStore,
      remove: removeMnemonic
    }
  ] = StorageHook.useStorage(
    {
      key: "mnemonic",
      instance: secureStorage.plasmoSecureStorage
    },
    (v) => (v === undefined ? "" : v)
  )
  // 使用 SecureStorage 實例來存取和儲存資料
  return (
    <>
      <input
        className="plasmo-w-4/5 plasmo-text-lg"
        onChange={(e) => setMnemonic(e.target.value)}
        value={mnemonic}
      />
    </>
  )
}

export default IndexPopup
