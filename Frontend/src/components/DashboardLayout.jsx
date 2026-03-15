import Sidebar from './Sidebar'

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar fixed on the left */}
            <Sidebar />

            {/* Main content area takes up remaining space and scrolls independently if needed */}
            <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
