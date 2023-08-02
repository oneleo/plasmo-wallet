import * as React from "react"

import * as SecureStorage from "@plasmohq/storage/secure"

import * as StorageUtils from "~utils/storage"

interface ContextInterface {
  secureStorage: SecureStorage.SecureStorage
  setSecureStorage: React.Dispatch<
    React.SetStateAction<SecureStorage.SecureStorage>
  >
}

export const Context = React.createContext<ContextInterface>(null)

export const ContextProvider = ({ children }) => {
  const storageConfig: StorageUtils.StorageConfig = {
    area: "local"
  }
  const [storageReady, setStorageReady] = React.useState<boolean>(false)
  const [secureStorage, setSecureStorage] =
    React.useState<SecureStorage.SecureStorage>(
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
    <Context.Provider
      value={
        {
          secureStorage: secureStorage,
          setSecureStorage: setSecureStorage
        } as ContextInterface
      }>
      {children}
    </Context.Provider>
  )
}

export const useSecureStorage = () => {
  return React.useContext(Context)
}

/* 
// 此 SecureStorageContext 使用方式
import * as React from "react"
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
  const secureStorage = React.useContext(SecureStorage.Context)
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
      instance: secureStorage.secureStorage
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
