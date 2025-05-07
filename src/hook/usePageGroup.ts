import { useEffect, useState } from "react";

export const usePageGroup = (total: number, page: number, limit: number) => {
  const [pageGroupStart, setPageGroupStart] = useState(1);
  const [visiblePageCount, setVisiblePageCount] = useState(3); // 화면에 보여줄 최대 페이지 수

  const getPageGroup = () => {
    const totalPages = Math.ceil(total / limit);
    const groupEnd = Math.min(
      pageGroupStart + visiblePageCount - 1,
      totalPages
    );
    return Array.from(
      { length: groupEnd - pageGroupStart + 1 },
      (_, i) => pageGroupStart + i
    );
  };

  const handlePrevGroup = () => {
    if (pageGroupStart > 1) {
      setPageGroupStart(Math.max(pageGroupStart - visiblePageCount, 1));
    }
  };

  const handleNextGroup = () => {
    const totalPages = Math.ceil(total / limit);
    if (pageGroupStart + visiblePageCount <= totalPages) {
      setPageGroupStart(pageGroupStart + visiblePageCount);
    }
  };

  useEffect(() => {
    // ✅ 페이지가 다른 그룹에 속하면 pageGroupStart 업데이트
    if (page < pageGroupStart || page >= pageGroupStart + visiblePageCount) {
      setPageGroupStart(
        Math.floor((page - 1) / visiblePageCount) * visiblePageCount + 1
      );
    }
  }, [page]);

  return {
    getPageGroup,
    setVisiblePageCount,
    handlePrevGroup,
    handleNextGroup,
    pageGroupStart,
    visiblePageCount,
  };
};
