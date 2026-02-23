// "React Native Store"
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
//Hola
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return ""

  const lower = text.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}