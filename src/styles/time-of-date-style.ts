export type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night";

interface BackgroundStyle {
  background: string;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
  shadowColor: string;
  greeting: string;
  description: string;
}

export function getBackgroundStyle(timeOfDay: TimeOfDay): BackgroundStyle {
  switch (timeOfDay) {
    case "dawn":
      return {
        background: "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
        textColor: "#2a1f14",
        secondaryTextColor: "#4a3c2a",
        borderColor: "#c1a66b",
        shadowColor: "#5c4b32",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    case "morning":
      return {
        background: "linear-gradient(135deg, #a8c0ff 0%, #b8a9c9 100%)",
        textColor: "#f8f9ff",
        secondaryTextColor: "#e8eaff",
        borderColor: "#9ba3d0",
        shadowColor: "#7c8bc0",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    case "afternoon":
      return {
        background: "linear-gradient(135deg, #f9f5ec 0%, #e8d5c4 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    case "evening":
      return {
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    case "night":
      return {
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        textColor: "#ecf0f1",
        secondaryTextColor: "#bdc3c7",
        borderColor: "#7f8c8d",
        shadowColor: "#2c3e50",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
    default:
      return {
        background: "linear-gradient(135deg, #f9f5ec 0%, #e8d5c4 100%)",
        textColor: "#5c4b32",
        secondaryTextColor: "#7a6144",
        borderColor: "#bfae96",
        shadowColor: "#8c7a5c",
        greeting: "🏝️ 내가 관리하는 섬",
        description: "친구들과 함께할 수 있는 나만의 섬들을 관리해보세요",
      };
  }
}
