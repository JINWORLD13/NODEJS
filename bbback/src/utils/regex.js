// const Regex = (props) => {
//   const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;
//   const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
//   const nameRegex = /^[가-힣]{2,}$/u;
//   const phoneNumberRegex = /^\d{11}$/;

//   if (nameRegex.test(props) === true) {
//     return true;
//   } else if (emailRegex.test(props) === true) {
//     return true;
//   } else if (passwordRegex.test(props) === true) {
//     return true;
//   } else if (phoneNumberRegex.test(props) === true) {
//     return true;
//   } else {
//     return false;
//   }
// };

const Regex = (input, type) => {
  switch (type) {
    case 'email':
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(input);
    case 'password':
      return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(input);
    case 'name':
      return /^[a-zA-Z가-힣]{2,}$/.test(input);
    case 'phone':
      return /^\d{2,3}-\d{3,4}-\d{4}$|^\d{10,11}$/.test(input);
    default:
      return false;
  }
};

export default Regex;

// module.exports = Regex;
