import * as React from "react"
import * as WouterLocation from "wouter/use-location"

// returns the current hash location in a normalized form
// (excluding the leading '#' symbol)
const hashLocation = () => window.location.hash.replace(/^#/, "") || "/"

const hashNavigate = (to) => WouterLocation.navigate("#" + to)

export const useHashLocation: WouterLocation.BaseLocationHook = () => {
  const location = WouterLocation.useLocationProperty<string>(hashLocation)
  //   const [location, setLocation] = React.useState<string>(
  //     // Wouter.useLocationProperty(hashLocation)
  //     hashLocation
  //   )
  //   const handlerSetLocation = () => {
  //     // setLocation(Wouter.useLocationProperty(hashLocation))
  //     location = Wouter.useLocationProperty(hashLocation)
  //     console.log(`[action] handlerSetLocation.`)
  //   }

  //   React.useEffect(() => {
  //     // 註冊事件：hashchange
  //     // 事件發生執行：handlerSetLocation
  //     // 註：更多 window 事件請參考：https://developer.mozilla.org/en-US/docs/Web/API/Window#history_events
  //     window.addEventListener("hashchange", handlerSetLocation)
  //     // 進入 React componentWillUnmount 生命週期時執行「移除 hashchange 事件監聽」
  //     return () => window.removeEventListener("hashchange", handlerSetLocation)
  //   }, [])

  React.useEffect(() => {
    // 偵測到 Router 跳轉時將視窗移至最左上角
    window.scrollTo(0, 0)
    console.log(`[window] scroll to (0, 0).`)
  }, [location])

  return [location, hashNavigate]
}
