import momentMin from "./moment.min";
export function formatDate(date, format) {
    return momentMin(date).format(format);
  }
  
  // Функция для вычисления разницы между двумя датами
export function dateDiff(startDate, endDate, unit) {
  return momentMin(endDate).diff(startDate, unit);
}