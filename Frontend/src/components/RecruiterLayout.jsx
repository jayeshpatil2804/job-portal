import RecruiterSidebar from './RecruiterSidebar'

const RecruiterLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50 uppercase shadow-sm">
            {/* Sidebar fixed on the left */}
            <RecruiterSidebar />

            {/* Main content area takes up remaining space and scrolls independently if needed */}
            <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RecruiterLayout
