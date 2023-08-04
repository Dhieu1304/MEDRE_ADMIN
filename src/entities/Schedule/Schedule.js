class Schedule {
  constructor({
    id = "",
    idDoctor = "",
    dayOfWeek = "",
    idTime = "",
    type = "",
    applyFrom = "",
    applyTo = "",
    createdAt = "",
    updatedAt = "",
    deletedAt = "",
    timeSchedule = "",
    bookings = []
  }) {
    this.id = id;
    this.doctorId = idDoctor;
    this.dayOfWeek = dayOfWeek;
    this.timeId = idTime;
    this.type = type;
    this.applyFrom = applyFrom;
    this.applyTo = applyTo;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.timeSchedule = timeSchedule;
    this.bookings = bookings;
  }

  static magicWord = () => "Schedule";
}

export default Schedule;
