export function formatDate(date: string): string {
  const createdAt = new Date(date);
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

  return seconds < 60
    ? `moments ago`
    : minutes === 1
    ? `${minutes} minute ago`
    : minutes < 60
    ? `${minutes} minutes ago`
    : hours < 24
    ? `${hours} hours ago`
    : days < 30
    ? `${days} days ago`
    : months < 12
    ? `${months} months ago`
    : `${years} years ago`;
}
