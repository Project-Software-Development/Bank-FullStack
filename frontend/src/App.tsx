import { Navigate, Route, Routes } from 'react-router-dom'
import { RegisterPage } from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/cadastro" replace />} />
    </Routes>
  )
}

export default App
