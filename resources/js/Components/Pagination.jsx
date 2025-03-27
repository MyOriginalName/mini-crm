import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length === 3) {
        return (
            <div className="flex flex-wrap -mb-1">
                {links.map((link, key) => (
                    <Link
                        key={key}
                        href={link.url}
                        className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-gray-100 focus:border-indigo-500 focus:text-indigo-500 ${
                            link.active ? 'bg-blue-700 text-white' : ''
                        } ${!link.url ? 'text-gray-400 cursor-not-allowed' : ''}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        );
    }

    return null;
} 