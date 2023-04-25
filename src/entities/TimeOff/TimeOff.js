class TimeOff {
  constructor({
    id = "",
    doctorId = "",
    from = "",
    to = "",
    timeStart = "",
    timeEnd = "",
    createdAt = "",
    updatedAt = "",
    deletedAt = ""
  } = {}) {
    this.id = id;
    this.doctorId = doctorId;
    this.from = from;
    this.to = to;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static magicWord = () => "TimeOff";
}

export default TimeOff;
