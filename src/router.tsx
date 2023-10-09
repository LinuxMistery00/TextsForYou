import { createBrowserRouter } from 'react-router-dom'
import TextForm from './components/textform/TextForm'

const router = createBrowserRouter([
    {
        path: '/',
        element: <TextForm/>
    }
])

export default router