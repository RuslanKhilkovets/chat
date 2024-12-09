export const getInitials = (name: string | undefined) => {
  if (!name) return 'N/A';
  return name.charAt(0).toUpperCase();
};

export default getInitials;
