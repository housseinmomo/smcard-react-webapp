import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HttpClient from './pages/HttpClient'
import WebsocketClient from './pages/WebsocketClient'
import WebsocketClient2 from './pages/WebsocketClient2'
import AddProfileForm from './pages/AddProfileForm'
import AddFamilyMemberForm from './pages/AddFamilyMemberForm'
import SmartCardInit from './pages/SmartCardInit'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <WebsocketClient /> */}
    {/* <HttpClient /> */}
    <WebsocketClient2 />
    {/* <AddProfileForm /> */}
    {/* <AddFamilyMemberForm /> */}
    {/* <SmartCardInit /> */}
  </StrictMode>,
)
