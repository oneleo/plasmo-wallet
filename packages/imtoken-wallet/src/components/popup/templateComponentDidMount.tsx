import * as React from "react"
import * as Wouter from "wouter"

import { LocaleName } from "~utils/locale"
import { MessagingName } from "~utils/messaging"
import { RoutePath } from "~utils/router"
import { StorageKey } from "~utils/storage"

export const Store: React.FunctionComponent = () => {
  const [location, setLocation] = Wouter.useLocation()
  const [error, setError] = React.useState<string>()

  React.useEffect(() => {
    const asyncFunc = async () => {
      await handlerComponentDidMount()
    }
    asyncFunc()
  }, [])

  const handlerComponentDidMount = React.useCallback(async () => {
    // 跳轉至儲存建立助記詞頁面
    setLocation(RoutePath.create)
  }, [])

  return (
    <>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <span className="plasmo-order-3 plasmo-text-red-500 plasmo-font-bold plasmo-text-base plasmo-py-3 plasmo-px-3">
          {error ? error : null}
        </span>
      </div>
    </>
  )
}
