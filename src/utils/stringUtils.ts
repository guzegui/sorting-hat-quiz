function capitalizeFirstLetterOfEachWord(value: string): string {
  const str = String(value ?? "").trim();
  if (!str) return "";
  return str
    .split(/\s+/)
    .map(
      (w) => w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase()
    )
    .join(" ");
}

export { capitalizeFirstLetterOfEachWord };
