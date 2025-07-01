import React from "react";
import GlassCard from "./GlassCard";
import GlassCardAdvanced from "./GlassCardAdvanced";

export default function GlassCardDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🪟 GlassCard 데모
        </h1>

        {/* 기본 GlassCard */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">기본 GlassCard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard blur="sm" opacity={0.1}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                약한 블러
              </h3>
              <p className="text-gray-700">blur=&quot;sm&quot;, opacity=0.1</p>
            </GlassCard>

            <GlassCard blur="md" opacity={0.15}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                중간 블러
              </h3>
              <p className="text-gray-700">blur=&quot;md&quot;, opacity=0.15</p>
            </GlassCard>

            <GlassCard blur="lg" opacity={0.2}>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                강한 블러
              </h3>
              <p className="text-gray-700">blur=&quot;lg&quot;, opacity=0.2</p>
            </GlassCard>
          </div>
        </section>

        {/* 고급 GlassCard */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">고급 GlassCard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCardAdvanced variant="frosted" hover>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Frosted
              </h3>
              <p className="text-gray-700">서리 낀 유리 효과</p>
            </GlassCardAdvanced>

            <GlassCardAdvanced variant="crystal" hover>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Crystal
              </h3>
              <p className="text-gray-700">크리스탈 같은 투명도</p>
            </GlassCardAdvanced>

            <GlassCardAdvanced variant="mirror" hover>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Mirror
              </h3>
              <p className="text-gray-700">거울 같은 반사 효과</p>
            </GlassCardAdvanced>

            <GlassCardAdvanced variant="tinted" hover>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Tinted
              </h3>
              <p className="text-gray-700">파란색 틴트 효과</p>
            </GlassCardAdvanced>
          </div>
        </section>

        {/* 다양한 설정 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">다양한 설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCardAdvanced
              variant="crystal"
              blur="xl"
              shadow="xl"
              opacity={0.25}
              hover
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                강한 효과
              </h3>
              <p className="text-gray-700">
                blur=&quot;xl&quot;, shadow=&quot;xl&quot;, opacity=0.25
              </p>
            </GlassCardAdvanced>

            <GlassCardAdvanced
              variant="mirror"
              blur="sm"
              shadow="sm"
              opacity={0.1}
              border={false}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                미니멀
              </h3>
              <p className="text-gray-700">
                blur=&quot;sm&quot;, shadow=&quot;sm&quot;, border=false
              </p>
            </GlassCardAdvanced>
          </div>
        </section>

        {/* 실제 사용 예시 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">실제 사용 예시</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCardAdvanced
              variant="frosted"
              className="h-48 flex flex-col justify-center"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">🎮</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  게임 카드
                </h3>
                <p className="text-gray-700">게임 정보를 표시하는 카드</p>
              </div>
            </GlassCardAdvanced>

            <GlassCardAdvanced
              variant="crystal"
              className="h-48 flex flex-col justify-center"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  프로필 카드
                </h3>
                <p className="text-gray-700">사용자 프로필 정보</p>
              </div>
            </GlassCardAdvanced>

            <GlassCardAdvanced
              variant="tinted"
              className="h-48 flex flex-col justify-center"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  통계 카드
                </h3>
                <p className="text-gray-700">데이터 통계 표시</p>
              </div>
            </GlassCardAdvanced>
          </div>
        </section>
      </div>
    </div>
  );
}
