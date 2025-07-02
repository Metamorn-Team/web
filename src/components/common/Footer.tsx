"use client";

import React from "react";
import { FaInstagram } from "react-icons/fa";
import { SiKakaotalk } from "react-icons/si";
import {
  INSTAGRAM_URL,
  KAKAO_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_USE_URL,
} from "@/constants/constants";

interface FooterProps {
  className?: string;
  theme?: "default" | "dark" | "uniform";
}

export default function Footer({ className, theme = "default" }: FooterProps) {
  // 테마별 색상 설정
  const getThemeColors = () => {
    switch (theme) {
      case "dark":
        return {
          primary: "text-gray-800",
          secondary: "text-gray-500",
        };
      case "uniform":
        return {
          primary: "text-gray-600",
          secondary: "text-gray-600",
        };
      default:
        return {
          primary: "text-gray-700",
          secondary: "text-gray-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <footer
      className={`w-full max-w-[1150px] mx-auto text-[12px] mt-20 m-3 transition-colors duration-1000 ${className} px-4`}
    >
      <div className="mx-auto py-6 flex flex-col gap-4">
        {/* 상단 메뉴 */}
        <nav className="flex flex-wrap gap-4 justify-center sm:justify-start font-medium">
          <a
            href={TERMS_OF_USE_URL}
            target="_blank"
            className={`${colors.primary} hover:opacity-80 transition-opacity duration-200`}
          >
            이용약관
          </a>
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            className={`${colors.primary} hover:opacity-80 transition-opacity duration-200`}
          >
            개인정보처리방침
          </a>
        </nav>

        {/* 회사 정보 및 소셜 */}
        <div className="w-full flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center pt-4">
          <div className={`leading-relaxed ${colors.secondary}`}>
            <p className="w-fit">
              리브아일랜드 | 대표:{" "}
              {process.env.NEXT_PUBLIC_COMPANY_REPRESENTATIVE} | 사업자등록번호:{" "}
              {process.env.NEXT_PUBLIC_BUSINESS_NUMBER}
            </p>
            <p className="flex flex-wrap gap-x-1 md:flex-col">
              <span>{process.env.NEXT_PUBLIC_COMPANY_ADDRESS} |</span>
              <span className="whitespace-nowrap">
                이메일: {process.env.NEXT_PUBLIC_COMPANY_EMAIL} |
              </span>
              <span className="whitespace-nowrap">
                전화번호: {process.env.NEXT_PUBLIC_COMPANY_PHONE}
              </span>
            </p>
            <p className="w-fit">
              ⓒ 리브아일랜드 Co., Ltd. All Rights Reserved.
            </p>
          </div>

          <div className={`flex gap-3 text-xl ${colors.secondary}`}>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <SiKakaotalk />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
