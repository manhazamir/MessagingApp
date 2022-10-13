export const getRandomColor = () => {
  const colors = ["#2a3eb1", "#1c54b2", "#00b0ff", "#00a0b2"];
  return colors[Math.floor(Math.random() * (colors.length - 1))];
};
