import { createContext, Dispatch, SetStateAction } from "react"

const AppContext = createContext<{
  zoom: number, 
  setZoom: Dispatch<SetStateAction<number>>
}>({ zoom: 1, setZoom: () => null })

export default AppContext