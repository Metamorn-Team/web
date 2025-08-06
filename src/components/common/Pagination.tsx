"use client";

import React from "react";
import GlassButton from "./GlassButton";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageInfo?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showPageInfo = false,
}: PaginationProps) {
  // 표시할 페이지 번호들을 계산 (5개씩 그룹)
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    // 현재 페이지가 속한 그룹 계산 (1-5, 6-10, 11-15, ...)
    const currentGroup = Math.ceil(currentPage / 5);
    const groupStart = (currentGroup - 1) * 5 + 1;
    const groupEnd = Math.min(currentGroup * 5, totalPages);

    // 현재 그룹의 페이지들 추가
    for (let i = groupStart; i <= groupEnd; i++) {
      pages.push(i);
    }

    // 다음 그룹이 있으면 "..." 추가
    if (groupEnd < totalPages) {
      pages.push("...");
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* 이전 페이지 버튼 */}
      <GlassButton
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        variant="ghost"
        className="px-3 py-2 text-sm"
      >
        &lt;
      </GlassButton>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === "number" ? (
              <GlassButton
                onClick={() => handlePageClick(page)}
                variant={page === currentPage ? "primary" : "ghost"}
                className={`px-3 py-2 text-sm min-w-[40px] ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </GlassButton>
            ) : (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 다음 페이지 버튼 */}
      <GlassButton
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        variant="ghost"
        className="px-3 py-2 text-sm"
      >
        &gt;
      </GlassButton>

      {/* 페이지 정보 */}
      {showPageInfo && (
        <div className="ml-4 text-sm text-gray-600">
          {currentPage} / {totalPages} 페이지
        </div>
      )}
    </div>
  );
}

// 간단한 버전의 페이징 컴포넌트
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: Omit<PaginationProps, "showPageInfo">) {
  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <GlassButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        variant="ghost"
        size="sm"
      >
        &lt;
      </GlassButton>

      <span className="px-4 py-2 text-sm font-medium">
        {currentPage} / {totalPages}
      </span>

      <GlassButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        variant="ghost"
        size="sm"
      >
        &gt;
      </GlassButton>
    </div>
  );
}
