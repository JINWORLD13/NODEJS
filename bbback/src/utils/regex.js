const Regex = (props) => {
  const emailRegex = /^[\w-.]+@([\w-]+.)+[\w-]{2,}$/i;
  const passwordRegex = /^(?=.[A-Z])(?=.[a-z])(?=.*\d).{8,}$/;
  const nameRegex = /^[a-zA-Z가-힣]{2,}$/u;
  const phoneNumberRegex = /^\d{11}$/;

  if (nameRegex.test(props)) {
    return true;
  } else if (emailRegex.test(props)) {
    return true;
  } else if (passwordRegex.test(props)) {
    return true;
  } else if (phoneNumberRegex.test(props)) {
    return true;
  } else {
    return false;
  }
};

module.exports = Regex;
