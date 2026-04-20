export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const formatDisplayDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
