import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function Pagination({ links, className }) {
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {links.map((link, i) => {
        if (!link.url) return null;

        return (
          <Link
            key={i}
            href={link.url}
            className={cn(
              "relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
              link.active
                ? "z-10 bg-neutral-900 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
            )}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        );
      })}
    </div>
  );
} 