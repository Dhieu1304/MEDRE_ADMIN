import { Expertise } from "../Expertise";

class Staff {
  constructor({
    id = "",
    username = "",
    phoneNumber = "",
    email = "",
    password = "",
    name = "",
    image = "",
    address = "",
    gender = "",
    dob = "",
    role = "",
    emailVerified = "",
    phoneVerified = "",
    healthInsurance = "",
    blocked = false,
    description = "",
    education = "",
    certificate = "",
    createdAt = "",
    updatedAt = "",
    expertises = []
  } = {}) {
    this.id = id;
    this.username = username;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = password;
    this.name = name;
    this.image = image;
    this.address = address;
    this.gender = gender;
    this.dob = dob;
    this.role = role;
    this.emailVerified = emailVerified;
    this.phoneVerified = phoneVerified;
    this.healthInsurance = healthInsurance;
    this.blocked = blocked;
    this.description = description;
    this.education = education;
    this.certificate = certificate;
    this.createdAt = { ...createdAt };
    this.updatedAt = { ...updatedAt };
    this.expertises = [...expertises].map((expertise) => new Expertise(expertise));
  }

  static magicWord = () => "Staff";
}

export default Staff;
