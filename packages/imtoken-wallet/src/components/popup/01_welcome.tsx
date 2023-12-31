import * as React from "react"
import * as Wouter from "wouter"

import { LocaleName } from "~utils/locale"
import { RoutePath } from "~utils/router"

export const Welcome: React.FunctionComponent = () => {
  const [location, setLocation] = Wouter.useLocation()

  const handleLocation = () => {
    // 跳轉至輸入密碼頁面
    setLocation(RoutePath.password)
  }

  return (
    <>
      <div className="plasmo-text-2xl">
        <span className="plasmo-text-2xl">
          {chrome.i18n.getMessage(LocaleName[LocaleName.welcome])}
        </span>
        <span className="plasmo-m-3 plasmo-animate-pulse">imToken</span>
      </div>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <button
          onClick={handleLocation}
          className="plasmo-order-1 plasmo-bg-blue-400 hover:plasmo-bg-blue-600 plasmo-text-white plasmo-py-3 plasmo-px-4">
          {chrome.i18n.getMessage(LocaleName[LocaleName.create])}
        </button>
      </div>
    </>
  )
}
