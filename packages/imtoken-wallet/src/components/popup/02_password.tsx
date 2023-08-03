import * as React from "react"
import * as Wouter from "wouter"

import * as Messaging from "@plasmohq/messaging"

import * as ContextPassword from "~components/context/password"
import { RoutePath } from "~utils/router"

export const Password: React.FunctionComponent = () => {
  const [location, setLocation] = Wouter.useLocation()
  const [password, setPassword] = React.useState<string>("")

  const contextPassword = React.useContext(ContextPassword.Context)

  const handlerInputOnChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target
      setPassword(value)
    },
    [password]
  )

  const handlerButtonOnClick = React.useCallback(() => {
    // 將密碼經過 Base-64 編碼後透過 Message 存入 Context 的 password 變數中
    contextPassword.setPassword(btoa(password))
    // 跳轉至儲存密碼頁面
    setLocation(RoutePath.store)
  }, [contextPassword.password, password])

  return (
    <>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <input
          type="password"
          id="password"
          onChange={handlerInputOnChange}
          value={password}
          className="plasmo-order-1 plasmo-px-52 plasmo-py-3 plasmo-rounded-lg plasmo-border plasmo-border-gray-300
           focus:plasmo-ring-blue-500"
        />
      </div>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <button
          type="button"
          onClick={handlerButtonOnClick}
          className="plasmo-order-1 plasmo-bg-blue-400 hover:plasmo-bg-blue-600 plasmo-text-white plasmo-py-3 plasmo-px-4">
          {chrome.i18n.getMessage("set_password")}
        </button>
      </div>
    </>
  )

  // return (
  //   <>
  //     <ContextPassword.ContextProvider>
  //       <Child1 />
  //       <Child2 />
  //     </ContextPassword.ContextProvider>
  //   </>
  // )
}

const Child1 = () => {
  const [password, setPassword] = React.useState<string>("")
  const contextPassword = React.useContext(ContextPassword.Context)

  const handlerInputOnChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = event.target
      switch (id) {
        case "password":
          setPassword(value)
          break
        default:
          break
      }
      setPassword(value)
    },
    [password]
  )

  const handlerButtonOnClick = React.useCallback(() => {
    // 將密碼經過 Base-64 編碼後透過 Message 存入 LocalStorage
    contextPassword.setPassword(btoa(password))
    console.log(`設置完成`)
  }, [password])

  return (
    <>
      <input
        type="password"
        id="password"
        onChange={handlerInputOnChange}
        value={password}
      />
      <button type="button" onClick={handlerButtonOnClick}>
        設置密碼
      </button>
    </>
  )
}

const Child2 = () => {
  const [password, setPassword] = React.useState<string>("")
  const contextPassword = React.useContext(ContextPassword.Context)

  React.useEffect(() => {
    const setStorage = async () => {
      const resp = await Messaging.sendToBackground({
        name: "saveToStorage" as keyof Messaging.MessagesMetadata,
        body: { key: "password", rawValue: btoa(password) }
      })
      console.log(`resp: ${JSON.stringify(resp, null, 2)}`)
    }
    setStorage()
  }, [])

  return (
    <>
      <span>設置完成</span>
      <button>下一頁</button>
    </>
  )
}
