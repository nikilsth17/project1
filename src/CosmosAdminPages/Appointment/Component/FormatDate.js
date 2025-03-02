export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

 export const formatDatev2 = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };
  



  export const formatDateTime = (dateString) => {
    const date = new Date(`${dateString}`);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
  
    const dateOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
  
    const weekdayOptions = {
      weekday: "long",
    };
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
  
    const formattedDate = date.toLocaleDateString("en-AU", dateOptions);
    const formattedWeekday = date.toLocaleDateString("en-AU", weekdayOptions);
    const formattedTime = date.toLocaleTimeString("en-AU", timeOptions);
  
    return `${formattedTime}, ${formattedWeekday}, ${formattedDate}`;
  };
  