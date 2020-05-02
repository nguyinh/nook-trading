export default () => {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const thisSunday = new Date(
    today.setDate(today.getDate() - today.getDay())
  );

  return thisSunday;
};