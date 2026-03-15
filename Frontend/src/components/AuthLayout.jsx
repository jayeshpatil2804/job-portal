import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const AuthLayout = ({ children, title, subtitle, theme = 'blue' }) => {
    const isBlue = theme === 'blue'
    const brandColor = isBlue ? '#1a3c8f' : '#f97316'
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <Link to="/" className="text-center block">
                    <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className={`text-2xl font-extrabold`}
                        style={{ color: brandColor }}
                    >
                        LOSODHAN
                    </motion.span>
                </Link>
                <h2 className="mt-4 text-center text-2xl font-extrabold text-gray-900">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-center text-sm text-gray-600">
                        {subtitle}
                    </p>
                )}
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-6 sm:mx-auto sm:w-full sm:max-w-md"
            >
                <div className="bg-white py-6 px-4 shadow-lg sm:rounded-xl sm:px-8 border border-gray-100 relative overflow-hidden">
                    {/* Top colored accent line */}
                    <div 
                        className="absolute top-0 left-0 w-full h-1.5"
                        style={{ backgroundColor: brandColor }}
                    />
                    
                    {children}
                </div>
            </motion.div>
        </div>
    )
}

export default AuthLayout

