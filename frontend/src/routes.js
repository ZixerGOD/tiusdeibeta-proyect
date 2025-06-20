import { AdminApp } from './pages/admin-app.jsx'
import { BoardDetails } from './pages/board-details.jsx'
import { Login } from './pages/login-page.jsx'

// Routes accesible from the main navigation (in AppHeader)
const routes = [
    {
        path: '/',
        component: <Login />,
        label: 'Login',
    },
    {
        path: 'board-details',
        component: <BoardDetails />,
        label: 'Board Details'
    },
    {
        path: 'admin',
        component: <AdminApp />,
        label: 'Admin Only'
    }
]

export default routes