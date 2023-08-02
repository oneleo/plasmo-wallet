import * as React from "react"

import * as Messaging from "@plasmohq/messaging"

import * as ContextPassword from "~components/context/password"

export const Password = () => {
  return (
    <>
      <ContextPassword.ContextProvider>
        <Child1 />
        <Child2 />
      </ContextPassword.ContextProvider>
    </>
  )
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
        name: "saveToStorage",
        body: { key: "password", rawValue: btoa(password) }
      })
      console.log(`resp: ${JSON.stringify(resp)}`)
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
