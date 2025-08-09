/**
 * ISO 시간 문자열을 다양한 포맷으로 변환하는 유틸리티 함수들
 */

// 기본 날짜 포맷 옵션
export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
  showTime?: boolean;
  showSeconds?: boolean;
  showYear?: boolean;
  showMonth?: boolean;
  showDay?: boolean;
  showWeekday?: boolean;
}

/**
 * ISO 문자열을 Date 객체로 변환
 */
export const parseISO = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * 현재 시간을 ISO 문자열로 반환
 */
export const getCurrentISO = (): string => {
  return new Date().toISOString();
};

/**
 * 상대적 시간 표시 (예: "3분 전", "1시간 전", "2일 전")
 */
export const getRelativeTime = (isoString: string): string => {
  const now = new Date();
  const target = new Date(isoString);
  const diffInMs = now.getTime() - target.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "방금 전";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks}주 전`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  } else {
    return `${diffInYears}년 전`;
  }
};

/**
 * 날짜를 한국어 포맷으로 변환
 */
export const formatKoreanDate = (
  isoString: string,
  options: DateFormatOptions = {}
): string => {
  const {
    showTime = false,
    showSeconds = false,
    showYear = true,
    showMonth = true,
    showDay = true,
    showWeekday = false,
  } = options;

  const date = parseISO(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const weekday = date.getDay();

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  let result = "";

  if (showYear) {
    result += `${year}년 `;
  }
  if (showMonth) {
    result += `${month}월 `;
  }
  if (showDay) {
    result += `${day}일`;
  }
  if (showWeekday) {
    result += ` (${weekdays[weekday]})`;
  }

  // 시간 부분
  if (showTime) {
    result += ` ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    if (showSeconds) {
      result += `:${seconds.toString().padStart(2, "0")}`;
    }
  }

  return result.trim();
};

/**
 * 간단한 날짜 포맷 (예: "2024.01.15")
 */
export const formatSimpleDate = (isoString: string): string => {
  const date = parseISO(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};

/**
 * 시간 포함 날짜 포맷 (예: "2024.01.15 14:30")
 */
export const formatDateTime = (isoString: string): string => {
  const date = parseISO(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

/**
 * 요일 포함 날짜 포맷 (예: "2024년 1월 15일 (월)")
 */
export const formatDateWithWeekday = (isoString: string): string => {
  return formatKoreanDate(isoString, { showWeekday: true });
};

/**
 * 시간만 표시 (예: "14:30")
 */
export const formatTime = (isoString: string): string => {
  const date = parseISO(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * 시간과 초 포함 (예: "14:30:25")
 */
export const formatTimeWithSeconds = (isoString: string): string => {
  const date = parseISO(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * 월/일 포맷 (예: "1월 15일")
 */
export const formatMonthDay = (isoString: string): string => {
  const date = parseISO(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};

/**
 * 년/월 포맷 (예: "2024년 1월")
 */
export const formatYearMonth = (isoString: string): string => {
  const date = parseISO(isoString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
};

/**
 * 게시판 스타일 날짜 (오늘: 시간, 어제: "어제", 그 이전: 날짜)
 */
export const formatBoardDate = (isoString: string): string => {
  const now = new Date();
  const target = parseISO(isoString);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const targetDate = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  if (targetDate.getTime() === today.getTime()) {
    return formatTime(isoString);
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return "어제";
  } else {
    return formatSimpleDate(isoString);
  }
};

/**
 * 채팅 스타일 날짜 (오늘: 시간, 어제: "어제 시간", 그 이전: 날짜 시간)
 */
export const formatChatDate = (isoString: string): string => {
  const now = new Date();
  const target = parseISO(isoString);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const targetDate = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  if (targetDate.getTime() === today.getTime()) {
    return formatTime(isoString);
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return `어제 ${formatTime(isoString)}`;
  } else {
    return `${formatSimpleDate(isoString)} ${formatTime(isoString)}`;
  }
};

/**
 * 기간 계산 (두 날짜 사이의 차이)
 */
export const getDuration = (startISO: string, endISO: string): string => {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const diffInMs = end.getTime() - start.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간`;
  } else {
    return `${diffInDays}일`;
  }
};

/**
 * 날짜가 오늘인지 확인
 */
export const isToday = (isoString: string): boolean => {
  const today = new Date();
  const target = parseISO(isoString);
  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
};

/**
 * 날짜가 어제인지 확인
 */
export const isYesterday = (isoString: string): boolean => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const target = parseISO(isoString);
  return (
    yesterday.getFullYear() === target.getFullYear() &&
    yesterday.getMonth() === target.getMonth() &&
    yesterday.getDate() === target.getDate()
  );
};

/**
 * 날짜가 이번 주인지 확인
 */
export const isThisWeek = (isoString: string): boolean => {
  const now = new Date();
  const target = parseISO(isoString);
  const weekStart = new Date(
    now.getTime() - now.getDay() * 24 * 60 * 60 * 1000
  );
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

  return target >= weekStart && target <= weekEnd;
};

/**
 * 날짜가 이번 달인지 확인
 */
export const isThisMonth = (isoString: string): boolean => {
  const now = new Date();
  const target = parseISO(isoString);
  return (
    now.getFullYear() === target.getFullYear() &&
    now.getMonth() === target.getMonth()
  );
};

/**
 * 날짜가 이번 년인지 확인
 */
export const isThisYear = (isoString: string): boolean => {
  const now = new Date();
  const target = parseISO(isoString);
  return now.getFullYear() === target.getFullYear();
};

export type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night";
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 6) return "dawn";
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
};
