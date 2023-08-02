import * as Wouter from "wouter"

export const Welcome = () => {
  const [location, setLocation] = Wouter.useLocation()
  const handleLocation = () => {
    // setLocation("/password")
    setLocation("/create")
  }

  return (
    <>
      <div className="plasmo-text-2xl">
        <span className="plasmo-text-2xl">
          {chrome.i18n.getMessage("welcome")}
        </span>
        <span className="plasmo-m-3 plasmo-animate-pulse">imToken</span>
      </div>
      <div className="plasmo-flex plasmo-flex-row plasmo-justify-evenly plasmo-content-center plasmo-flex-no-wrap">
        <button
          className="plasmo-order-1 plasmo-bg-blue-400 hover:plasmo-bg-blue-600 plasmo-text-white plasmo-py-3 plasmo-px-4"
          onClick={handleLocation}>
          {chrome.i18n.getMessage("create")}
        </button>
      </div>
    </>
  )
}
