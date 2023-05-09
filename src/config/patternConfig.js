const phonePattern = /^(84|0[3|5|7|8|9])+([0-9]{8})\b/;
const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const phoneOrEmailPattern = new RegExp(`${phonePattern.source}|${emailPattern.source}`);

const patternConfig = {
  phonePattern,
  emailPattern,
  phoneOrEmailPattern
};

export default patternConfig;
