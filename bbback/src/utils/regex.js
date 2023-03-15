const Regex = (props) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  const nameRegex = /^[가-힣]{2,}$/u;
  const phoneNumberRegex = /^\d{11}$/;

  if (nameRegex.test(props) === true) {
    return true;
  } else if (emailRegex.test(props) === true) {
    return true;
  } else if (passwordRegex.test(props) === true) {
    return true;
  } else if (phoneNumberRegex.test(props) === true) {
    return true;
  } else {
    return false;
  }
};

module.exports = Regex;
