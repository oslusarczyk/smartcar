import type { PaginationProps } from '../utils/types';

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mb-4 flex justify-center space-x-2" aria-label="Pagination">
      {pages.map((page) => {
        const isActive = currentPage === page;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`rounded-md border px-3 py-1 transition ${
              isActive
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-gray-300 bg-white text-black hover:bg-gray-100'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
