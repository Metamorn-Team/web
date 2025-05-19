export const linkify = (text: string) => {
  if (!text) return text;

  const urlRegex =
    /(https?:\/\/[^\s]+|www\.[^\s]+|\b[\w-]+\.[\w-]+(?:\.[\w-]+)*\b(?:\/[^\s]*)?)/gi;

  const urls = text.match(urlRegex) || [];
  let lastIndex = 0;
  const result = [];

  urls.forEach((url, index) => {
    const urlStart = text.indexOf(url, lastIndex);
    if (urlStart > lastIndex) {
      result.push(
        <span key={`text-${index}`}>{text.substring(lastIndex, urlStart)}</span>
      );
    }

    const href = url.startsWith("http")
      ? url
      : url.startsWith("www.")
      ? `https://${url}`
      : `https://www.${url}`;
    result.push(
      <a
        key={`link-${index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#6b4e2e] underline underline-offset-2 hover:text-[#4b3824]"
      >
        {url}
      </a>
    );

    lastIndex = urlStart + url.length;
  });

  if (lastIndex < text.length) {
    result.push(<span key="text-end">{text.substring(lastIndex)}</span>);
  }

  return result;
};
