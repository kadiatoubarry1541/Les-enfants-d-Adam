import { Route, Routes } from 'react-router-dom'
import { LivingChoice } from './LivingChoice'
import { VideoRegistration } from './VideoRegistration'
import { WrittenRegistration } from './WrittenRegistration'

export function LivingWizard() {
  return (
    <Routes>
      <Route path="/" element={<LivingChoice />} />
      <Route path="/video" element={<VideoRegistration />} />
      <Route path="/formulaire" element={<WrittenRegistration />} />
    </Routes>
  )
}