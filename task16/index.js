import { formatDate,  dateDiff } from "./dateModule";
// import momentMin from "./moment.min";

const currentDate = new Date();
const futureDate = new Date()
futureDate.setDate(futureDate.getDate() + 7);

const formattedDate = formatDate(currentDate, 'YYYY-MM-DD');
const daysDifference = dateDiff(currentDate, futureDate, 'days');

console.log('Текущая дата в формате YYYY-MM-DD:', formattedDate);
console.log('Разница в днях между текущей и будущей датой:', daysDifference);