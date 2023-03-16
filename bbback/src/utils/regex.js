const Regex = (input, type) => {
  switch (type) {
    case "email":
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(input);
    case "password":
      return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(input);
    case "name":
      return /^[a-zA-Z가-힣]{2,}$/.test(input);
    case "phone":
      return /^\d{2,3}-\d{3,4}-\d{4}$|^\d{10,11}$/.test(input);
    default:
      return false;
  }
};

module.exports = Regex;
