import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminProtectedRoute = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth)

    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return <Navigate to="/auth/admin/secure/login" replace />
    }

    return <Outlet />
}

export default AdminProtectedRoute 
