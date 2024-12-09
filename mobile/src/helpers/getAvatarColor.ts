export const getAvatarColor = (id: string) => {
  if (!id) return null;
  const colors = ['#FFA726', '#AB47BC', '#26C6DA', '#66BB6A', '#FF7043'];
  const index = id.charCodeAt(18) % colors.length;
  return colors[index];
};
export default getAvatarColor;
