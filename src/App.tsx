import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SiteLayout from '@/layouts/SiteLayout'
import Acasa from '@/pages/Acasa'
import IndexLectii from '@/pages/IndexLectii'
import LectiePage from '@/pages/Lectie'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Acasa />} />
          <Route path="lectii" element={<IndexLectii />} />
          <Route path="lectii/:sectiune/:slug" element={<LectiePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
