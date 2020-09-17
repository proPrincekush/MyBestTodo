let today = new Date();
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let currentDate = today.toLocaleDateString("en-US",options);
console.log(currentDate);
exports.currentTime = today.toLocaleTimeString();

exports.today = today;