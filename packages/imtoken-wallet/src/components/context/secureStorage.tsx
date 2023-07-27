import * as React from "react"

import * as SecureStorage from "@plasmohq/storage/secure"

import * as StorageUtils from "~utils/storage"

export const Context = React.createContext<{
  plasmoSecureStorage: SecureStorage.SecureStorage
}>(null)

export const ContextProvider = ({ children }) => {
  const storageConfig: StorageUtils.StorageConfig = {
    area: "local"
  }
  const [storageReady, setStorageReady] = React.useState<boolean>(false)
  const [secureStorage, _] = React.useState<SecureStorage.SecureStorage>(
    new SecureStorage.SecureStorage(storageConfig)
  )

  React.useEffect(() => {
    secureStorage
      .setPassword(process.env.PLASMO_PUBLIC_STORAGE_PASSWORD)
      .then(() => setStorageReady(true))
  }, [])

  if (!storageReady) {
    return null
  }

  return (
    <Context.Provider value={{ plasmoSecureStorage: secureStorage }}>
      {children}
    </Context.Provider>
  )
}

export const useSecureStorage = () => {
  return React.useContext(Context)
}

/* 
// 此 SecureStorageContext 使用方式
import * as SecureStorage from "~components/context/secureStorage"

const App = () => {
  return (
    <>
      <SecureStorage.ContextProvider>
        <Child />
      </SecureStorage.ContextProvider>
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
      <input onChange={(e) => setMnemonic(e.target.value)} value={mnemonic} />
    </>
  )
}
*/
