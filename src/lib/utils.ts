export function debounce(func: Function, delay: number = 300){
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func(...args); }, delay);
  };
}

export const handleImageError = (e: Event) => {
  // Fall back to default avatar if the image fails to load
  const target = e.target as HTMLImageElement;
  if (!target) return;
  target.src = "/assets/images/default-avatar.svg";
};
