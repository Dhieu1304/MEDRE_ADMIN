const phonePattern = /^(84|0[3|5|7|8|9])+([0-9]{8})\b/;
const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const phoneOrEmailPattern = new RegExp(`${phonePattern.source}|${emailPattern.source}`);
const phoneOrEmailOrIdPattern = new RegExp(`${phonePattern.source}|${emailPattern.source}|${uuidPattern.source}`);
const phoneOrIdPattern = new RegExp(`${phonePattern.source}|${uuidPattern.source}`);

const patternConfig = {
  phonePattern,
  emailPattern,
  phoneOrEmailPattern,
  uuidPattern,
  phoneOrEmailOrIdPattern,
  phoneOrIdPattern
};

export default patternConfig;
