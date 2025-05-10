interface TagProps {
  onClick: () => void;
  selectedTag: string;
  name: string;
}

const Tag = ({ onClick, selectedTag, name }: TagProps) => {
  return (
    <button
      key={name}
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded border transition ${
        selectedTag === name
          ? "bg-[#bfae96] text-white border-[#5c4b32]"
          : "bg-[#f3ece1] text-[#5c4b32] border-[#5c4b32]"
      } shadow-[2px_2px_0_#5c4b32] hover:bg-[#e8e0d0]`}
    >
      {name}
    </button>
  );
};

export default Tag;
