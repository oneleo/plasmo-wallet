import * as React from "react"
import * as Wouter from "wouter"
import { Route } from "wouter"

import * as Messaging from "@plasmohq/messaging"
import * as MessagingHook from "@plasmohq/messaging/hook"
import * as ContextStorageHook from "@plasmohq/storage/hook"

import * as ContextPassword from "~components/context/password"
import * as SecureStorage from "~components/context/secureStorage"
import * as PopupClear from "~components/popup/00_clear"
import * as PopupStart from "~components/popup/00_start"
import * as PopupWelcome from "~components/popup/01_welcome"
import * as PopupStore from "~components/popup/02_02_store"
import * as PopupPassword from "~components/popup/02_password"
import * as PopupCreate from "~components/popup/03_create"
import * as PopupWallet from "~components/popup/04_wallet"
import * as UtilsWagmi from "~components/popup/wagmi"
import { PortName } from "~utils/port"
import * as UtilsRouter from "~utils/router"
import { RoutePath } from "~utils/router"
import * as UtilsStorage from "~utils/storage"
import { StorageKey } from "~utils/storage"

import "~style.css"

import { disconnect } from "process"

function IndexPopup() {
  React.useEffect(() => {
    // 目前 Plasmo Port API 不支援傳送 onDisconnect 事件
    // const popupPort = MessagingHook.usePort("popupClosed")

    // 所以使用 Chrome 原生 Port API 來註冊一組 "popup" port
    // background 也同時會監聽 "popup" port 的連線
    const port = chrome.runtime.connect({ name: PortName[PortName.popup] })

    // 設定連線解除時的監聽器
    const handlerTest = async () => {
      // 在這裡做一些必要的清理工作
      console.log("Popup 視窗已關閉")
    }

    port.onDisconnect.addListener(handlerTest)

    // 移除監聽器以避免記憶體洩漏
    return () => {
      port.onDisconnect.removeListener(handlerTest)
    }
  }, [])

  // 注意：以下若使用 console.log，請使用 Inspect Popup 的 Dev Tools 查看，而非 Service Worker 的 Dev Tools
  return (
    <>
      {/* <UtilsWagmi.initWagmi /> */}
      <Wouter.Router hook={UtilsRouter.useHashLocation}>
        <Route path={RoutePath.root}>
          <Wouter.Redirect to={RoutePath.start} />
        </Route>
        <Route path={RoutePath.clear} component={PopupClear.Clear} />
        <Route path={RoutePath.start} component={PopupStart.Start} />
        <Route path={RoutePath.welcome} component={PopupWelcome.Welcome} />
        <ContextPassword.Provider>
          <Route path={RoutePath.password} component={PopupPassword.Password} />
          {/* <Route path={RoutePath.store} component={PopupStore.Store} /> */}
          <Route path={RoutePath.create} component={PopupCreate.Create} />
          <Route path={RoutePath.wallet} component={PopupWallet.Wallet} />
        </ContextPassword.Provider>
      </Wouter.Router>
    </>
  )
}

export default IndexPopup
