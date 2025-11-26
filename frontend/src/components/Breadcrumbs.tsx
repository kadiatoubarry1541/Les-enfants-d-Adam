import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400 dark:text-gray-500">
                  /
                </span>
              )}
              {isLast || !item.path ? (
                <span
                  className={`flex items-center gap-1 ${
                    isLast
                      ? "text-gray-900 dark:text-gray-100 font-semibold"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  {item.icon && <span>{item.icon}</span>}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

