export default function getPathName(): string {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '';
}
