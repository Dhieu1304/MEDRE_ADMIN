class User {
  constructor({
    id = "",
    phoneNumber = "",
    email = "",
    password = "",
    name = "",
    image = "",
    address = "",
    gender = "",
    dob = "",
    emailVerified = "",
    phoneVerified = "",
    healthInsurance = "",
    blocked = false,
    createdAt = "",
    updatedAt = "",
    deletedAt = ""
  } = {}) {
    this.id = id;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = password;
    this.name = name;
    this.image = image;
    this.address = address;
    this.gender = gender;
    this.dob = dob;
    this.emailVerified = emailVerified;
    this.phoneVerified = phoneVerified;
    this.healthInsurance = healthInsurance;
    this.blocked = blocked;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static magicWord = () => "User";
}

export default User;
