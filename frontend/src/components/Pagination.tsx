import React from 'react';
import type { PaginationProps } from '../utils/types';

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mb-4 flex justify-center space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => {
            onPageChange(page);
          }}
          className={`rounded-md border px-3 py-1 transition ${
            currentPage === page
              ? 'border-green-600 bg-green-600 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
          } `}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
