class TimeOff {
  constructor({ id = "", doctorId = "", date = "", timeStart = "", timeEnd = "", createdAt = "", updatedAt = "" } = {}) {
    this.id = id;
    this.doctorId = doctorId;
    this.date = date;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static magicWord = () => "TimeOff";
}

export default TimeOff;
