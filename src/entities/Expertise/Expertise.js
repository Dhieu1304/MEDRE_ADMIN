class Expertise {
  constructor({ id = "", name = "", createdAt = new Date(), updatedAt = new Date() } = {}) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static magicWord = () => "Expertise";
}

export default Expertise;
