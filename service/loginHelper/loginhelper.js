
exports.checkOtp = async (data) => {
    let { start } = data;
    const startDateTime = new Date(start);
    const endDateTime = new Date();
    
    const diffInSeconds =
      (endDateTime.getTime() - startDateTime.getTime()) / 1000;
    if (diffInSeconds > 300) {
      return false;
    } else {
      return true;
    }
  };


exports.generateOtp = async () => {
    const genOtp = Math.floor(1000 + Math.random() * 9000);
    return genOtp;
  };


  
