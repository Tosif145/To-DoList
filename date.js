
// module.exports.getDate = function getDate(){
exports.getDate = function getDate(){  // this works exactly same as the above line
  const today = new Date();

  const option = {
    weekday: "long",
    day: "numeric",
    month:"long"
  };


return today.toLocaleDateString("en-US",option);

}

exports.getDay = function getDay(){
  const today = new Date();

  const option = {
    weekday: "long"
  };


  return today.toLocaleDateString("en-US",option);

}
