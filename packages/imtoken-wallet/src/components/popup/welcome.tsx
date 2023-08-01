import * as Wouter from "wouter"

export const Welcome = () => {
  const [location, setLocation] = Wouter.useLocation()
  const handleLocation = () => {
    setLocation("/create")
  }

  return (
    <>
      <div className="plasmo-text-2xl">
        <span className="plasmo-text-2xl">
          {chrome.i18n.getMessage("welcome")}
        </span>
        <span>imToken</span>
      </div>
      <div>
        <button
          className="plasmo-bg-blue-500 hover:plasmo-bg-blue-700 plasmo-text-white plasmo-font-bold plasmo-py-2 plasmo-px-4 plasmo-rounded"
          onClick={handleLocation}>
          {chrome.i18n.getMessage("create")}
        </button>
      </div>
    </>
  )
}
