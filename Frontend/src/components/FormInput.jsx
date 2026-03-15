import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({ 
    label, 
    icon: Icon, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    required = false, 
    name, 
    theme = 'blue',
    ...props 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    
    const isBlue = theme === 'blue';
    const focusRingColor = isBlue ? 'focus:ring-[#1a3c8f]/20' : 'focus:ring-[#f97316]/20';
    const focusBorderColor = isBlue ? 'focus:border-[#1a3c8f]' : 'focus:border-[#f97316]';
    const iconFocusColor = isBlue ? 'group-focus-within:text-[#1a3c8f]' : 'group-focus-within:text-[#f97316]';
    const buttonHoverBg = isBlue ? 'hover:bg-blue-50' : 'hover:bg-orange-50';
    const buttonIconColor = isBlue ? 'text-[#1a3c8f]' : 'text-[#f97316]';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1.5"
        >
            <label className="block text-sm font-semibold text-gray-700 ml-1">
                {label}
            </label>
            <div className="relative group">
                {Icon && (
                    <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${iconFocusColor}`}>
                        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-current" />
                    </div>
                )}
                <input
                    name={name}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`block w-full ${Icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm transition-all duration-300 outline-none focus:ring-2 ${focusRingColor} ${focusBorderColor}`}
                    placeholder={placeholder}
                    {...props}
                />
                
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-all duration-200 ${buttonIconColor} opacity-70 hover:opacity-100`}
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default FormInput;
