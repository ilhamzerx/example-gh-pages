export function humanizeTime(time: number): string {
  const date = new Date(time * 1000);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
      return `${seconds} seconds ago`;
  } else if (minutes < 60) {
      return `${minutes} minutes ago`;
  } else if (hours < 24) {
      return `${hours} hours ago`;
  } else if (days < 7) {
      return `${days} days ago`;
  } else if (weeks < 4) {
      return `${weeks} weeks ago`;
  } else if (months < 12) {
      return `${months} months ago`;
  } else {
      return `${years} years ago`;
  }
}

export function getNowUnix(): number {
  return Date.now() / 1000 | 0;
}
