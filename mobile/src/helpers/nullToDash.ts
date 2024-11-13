export default function nullToDash(text: string | null | undefined) {
  return !!text ? text : '-';
}
