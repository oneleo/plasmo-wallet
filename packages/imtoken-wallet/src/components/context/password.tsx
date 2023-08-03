import * as React from "react"

interface ContextInterface {
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
}

export const Context = React.createContext<ContextInterface>({
  password: "",
  setPassword: (password: string) => {}
})

export const Provider = ({ children }) => {
  // 暫時存放密碼
  const [password, setPassword] = React.useState("")

  return (
    <Context.Provider
      value={
        { password: password, setPassword: setPassword } as ContextInterface
      }>
      {children}
    </Context.Provider>
  )
}
export const usePassword = () => {
  return React.useContext(Context)
}
