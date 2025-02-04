import React, {forwardRef} from 'react';
import {FaEdit, FaTrash} from 'react-icons/fa';

interface TextInputProps {
    name: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((
    {
        name,
        label,
        value,
        onChange,
        onFocus,
        onBlur,
        onKeyDown,
        onEdit,
        onDelete,
    },
    ref) => {
    return (
        <div className="mb-4 relative">
            <span className="block text-sm font-medium text-gray-700">
                {name}
            </span>
            <input
                type="text"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                ref={ref}
                className="outline-none border-2 border-gray-300 focus:border-indigo-500 block w-full text-lg sm:text-lg rounded-md mb-2 p-2 pr-10"
            />
            <label htmlFor={name} className="block text-xs font-medium text-gray-500 mb-1">
                {label}
            </label>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                {onEdit &&
                    <button
                        type="button"
                        onClick={onEdit}
                        className="text-blue-500"
                    >
                        <FaEdit/>
                    </button>
                }
                {onDelete &&
                    <button
                        type="button"
                        onClick={onDelete}
                        className="text-red-500"
                    >
                        <FaTrash/>
                    </button>
                }
            </div>
        </div>
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;
