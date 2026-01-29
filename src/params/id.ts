export function match(param) {
  return /^[0-9a-f]{8}$/i.test(param);
}