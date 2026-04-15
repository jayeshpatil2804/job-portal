import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onLimitChange }) => {
    const limits = [10, 25, 50, 100]

    const pages = () => {
        const pagesArray = []
        const maxVisible = 5
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pagesArray.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pagesArray.push(i)
                pagesArray.push('...')
                pagesArray.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pagesArray.push(1)
                pagesArray.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pagesArray.push(i)
            } else {
                pagesArray.push(1)
                pagesArray.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pagesArray.push(i)
                pagesArray.push('...')
                pagesArray.push(totalPages)
            }
        }
        
        return pagesArray
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Show:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onLimitChange(Number(e.target.value))}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#1a3c8f] cursor-pointer"
                >
                    {limits.map(limit => (
                        <option key={limit} value={limit}>{limit}</option>
                    ))}
                </select>
                <span className="text-gray-600">of {totalItems} items</span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="First page"
                >
                    <ChevronsLeft size={16} />
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                    {pages().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all ${
                                    currentPage === page
                                        ? 'bg-[#1a3c8f] text-white shadow-md'
                                        : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                >
                    <ChevronRight size={16} />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Last page"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
                Page <span className="font-bold text-[#1a3c8f]">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
            </div>
        </div>
    )
}

export default Pagination
