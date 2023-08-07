import * as React from "react"
import * as Wouter from "wouter"

import { LocaleName } from "~utils/locale"
import { MessagingName } from "~utils/messaging"
import { RoutePath } from "~utils/router"
import { StorageKey } from "~utils/storage"

export const Template: React.FunctionComponent = () => {
  const [location, setLocation] = Wouter.useLocation()
  const [error, setError] = React.useState<string>()

  const handlerButtonOnClick = React.useCallback(async () => {
    setLocation(RoutePath.store)
  }, [])

  return (
    <>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <button
          className="plasmo-order-2 plasmo-text-base plasmo-bg-blue-500 hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-bold plasmo-py-2 plasmo-px-4 plasmo-rounded"
          onClick={handlerButtonOnClick}>
          {chrome.i18n.getMessage(LocaleName[LocaleName.extensionName])}
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
