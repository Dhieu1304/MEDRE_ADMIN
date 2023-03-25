const schedules = [
  {
    id: 1,
    doctor_id: 1,
    date: "2023-03-03",
    type: "offline",
    status: "waiting",
    time: "7h30 - 8h",
    booking: { booking_id: 1, user_id: 5 }
  },
  {
    id: 2,
    doctor_id: 1,
    date: "2023-03-03",
    type: "offline",
    status: "booked",
    time: "8h - 8h30",
    booking: { booking_id: 2, user_id: 8 }
  },
  {
    id: 3,
    doctor_id: 1,
    date: "2023-03-03",
    type: "offline",
    status: "booked",
    time: "8h30 - 9h",
    booking: { booking_id: 3, user_id: 1 }
  },
  {
    id: 4,
    doctor_id: 1,
    date: "2023-03-03",
    type: "offline",
    status: "booked",
    time: "9h - 9h30",
    booking: { booking_id: 4, user_id: 1 }
  },
  {
    id: 5,
    doctor_id: 1,
    date: "2023-03-03",
    type: "online",
    status: "waiting",
    time: "9h30 - 10h",
    booking: { booking_id: 5, user_id: 1 }
  },
  {
    id: 6,
    doctor_id: 1,
    date: "2023-03-03",
    type: "offline",
    status: "waiting",
    time: "10h - 10h30",
    booking: { booking_id: 6, user_id: 5 }
  },
  {
    id: 7,
    doctor_id: 1,
    date: "2023-03-03",
    type: "online",
    status: "waiting",
    time: "10h30 - 11h",
    booking: { booking_id: 7, user_id: 2 }
  },
  {
    id: 8,
    doctor_id: 1,
    date: "2023-03-03",
    type: "online",
    status: "empty",
    time: "11h - 11h30",
    booking: {}
  },
  {
    id: 9,
    doctor_id: 1,
    date: "2023-03-03",
    type: "online",
    status: "waiting",
    time: "13h - 13h30",
    booking: { booking_id: 9, user_id: 5 }
  },
  {
    id: 10,
    doctor_id: 1,
    date: "2023-03-03",
    type: "offline",
    status: "empty",
    time: "13h30 - 14h",
    booking: {}
  },
  {
    id: 11,
    doctor_id: 1,
    date: "2023-03-03",
    type: "online",
    status: "empty",
    time: "14h - 14h30",
    booking: {}
  },
  {
    id: 12,
    doctor_id: 1,
    date: "2023-03-03",
    type: "online",
    status: "booked",
    time: "14h30 - 15h",
    booking: { booking_id: 12, user_id: 9 }
  },
  {
    id: 13,
    doctor_id: 1,
    date: "2023-03-03",
    type: "online",
    status: "booked",
    time: "15h - 15h30",
    booking: { booking_id: 13, user_id: 8 }
  },
  {
    id: 14,
    doctor_id: 1,
    date: "2023-03-03",
    type: "offline",
    status: "booked",
    time: "15h30 - 16h",
    booking: { booking_id: 14, user_id: 9 }
  },
  {
    id: 15,
    doctor_id: 1,
    date: "2023-03-03",
    type: "online",
    status: "waiting",
    time: "16h - 16h30",
    booking: { booking_id: 15, user_id: 3 }
  },
  {
    id: 16,
    doctor_id: 1,
    date: "2023-03-04",
    type: "offline",
    status: "booked",
    time: "",
    booking: { booking_id: 16, user_id: 1 }
  },
  {
    id: 17,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "waiting",
    time: "7h30 - 8h",
    booking: { booking_id: 17, user_id: 2 }
  },
  {
    id: 18,
    doctor_id: 1,
    date: "2023-03-04",
    type: "offline",
    status: "waiting",
    time: "8h - 8h30",
    booking: { booking_id: 18, user_id: 3 }
  },
  {
    id: 19,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "empty",
    time: "8h30 - 9h",
    booking: {}
  },
  {
    id: 20,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "waiting",
    time: "9h - 9h30",
    booking: { booking_id: 20, user_id: 1 }
  },
  {
    id: 21,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "waiting",
    time: "9h30 - 10h",
    booking: { booking_id: 21, user_id: 1 }
  },
  {
    id: 22,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "waiting",
    time: "10h - 10h30",
    booking: { booking_id: 22, user_id: 7 }
  },
  {
    id: 23,
    doctor_id: 1,
    date: "2023-03-04",
    type: "offline",
    status: "booked",
    time: "10h30 - 11h",
    booking: { booking_id: 23, user_id: 2 }
  },
  {
    id: 24,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "waiting",
    time: "11h - 11h30",
    booking: { booking_id: 24, user_id: 1 }
  },
  {
    id: 25,
    doctor_id: 1,
    date: "2023-03-04",
    type: "offline",
    status: "empty",
    time: "13h - 13h30",
    booking: {}
  },
  {
    id: 26,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "waiting",
    time: "13h30 - 14h",
    booking: { booking_id: 26, user_id: 5 }
  },
  {
    id: 27,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "booked",
    time: "14h - 14h30",
    booking: { booking_id: 27, user_id: 1 }
  },
  {
    id: 28,
    doctor_id: 1,
    date: "2023-03-04",
    type: "online",
    status: "waiting",
    time: "14h30 - 15h",
    booking: { booking_id: 28, user_id: 3 }
  },
  {
    id: 29,
    doctor_id: 1,
    date: "2023-03-04",
    type: "offline",
    status: "booked",
    time: "15h - 15h30",
    booking: { booking_id: 29, user_id: 1 }
  },
  {
    id: 30,
    doctor_id: 1,
    date: "2023-03-04",
    type: "offline",
    status: "booked",
    time: "15h30 - 16h",
    booking: { booking_id: 30, user_id: 2 }
  },
  {
    id: 31,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "booked",
    time: "16h - 16h30",
    booking: { booking_id: 31, user_id: 9 }
  },
  {
    id: 32,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "empty",
    time: "",
    booking: {}
  },
  {
    id: 33,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "booked",
    time: "7h30 - 8h",
    booking: { booking_id: 33, user_id: 4 }
  },
  {
    id: 34,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "booked",
    time: "8h - 8h30",
    booking: { booking_id: 34, user_id: 5 }
  },
  {
    id: 35,
    doctor_id: 1,
    date: "2023-03-05",
    type: "online",
    status: "booked",
    time: "8h30 - 9h",
    booking: { booking_id: 35, user_id: 6 }
  },
  {
    id: 36,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "empty",
    time: "9h - 9h30",
    booking: {}
  },
  {
    id: 37,
    doctor_id: 1,
    date: "2023-03-05",
    type: "online",
    status: "booked",
    time: "9h30 - 10h",
    booking: { booking_id: 37, user_id: 1 }
  },
  {
    id: 38,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "waiting",
    time: "10h - 10h30",
    booking: { booking_id: 38, user_id: 1 }
  },
  {
    id: 39,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "booked",
    time: "10h30 - 11h",
    booking: { booking_id: 39, user_id: 10 }
  },
  {
    id: 40,
    doctor_id: 1,
    date: "2023-03-05",
    type: "online",
    status: "booked",
    time: "11h - 11h30",
    booking: { booking_id: 40, user_id: 1 }
  },
  {
    id: 41,
    doctor_id: 1,
    date: "2023-03-05",
    type: "online",
    status: "booked",
    time: "13h - 13h30",
    booking: { booking_id: 41, user_id: 1 }
  },
  {
    id: 42,
    doctor_id: 1,
    date: "2023-03-05",
    type: "online",
    status: "booked",
    time: "13h30 - 14h",
    booking: { booking_id: 42, user_id: 6 }
  },
  {
    id: 43,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "waiting",
    time: "14h - 14h30",
    booking: { booking_id: 43, user_id: 1 }
  },
  {
    id: 44,
    doctor_id: 1,
    date: "2023-03-05",
    type: "offline",
    status: "booked",
    time: "14h30 - 15h",
    booking: { booking_id: 44, user_id: 1 }
  },
  {
    id: 45,
    doctor_id: 1,
    date: "2023-03-05",
    type: "online",
    status: "waiting",
    time: "15h - 15h30",
    booking: { booking_id: 45, user_id: 1 }
  },
  {
    id: 46,
    doctor_id: 1,
    date: "2023-03-06",
    type: "offline",
    status: "booked",
    time: "15h30 - 16h",
    booking: { booking_id: 46, user_id: 9 }
  },
  {
    id: 47,
    doctor_id: 1,
    date: "2023-03-06",
    type: "offline",
    status: "empty",
    time: "16h - 16h30",
    booking: {}
  },
  {
    id: 48,
    doctor_id: 1,
    date: "2023-03-06",
    type: "offline",
    status: "booked",
    time: "",
    booking: { booking_id: 48, user_id: 4 }
  },
  {
    id: 49,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "waiting",
    time: "7h30 - 8h",
    booking: { booking_id: 49, user_id: 6 }
  },
  {
    id: 50,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "booked",
    time: "8h - 8h30",
    booking: { booking_id: 50, user_id: 1 }
  },
  {
    id: 51,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "booked",
    time: "8h30 - 9h",
    booking: { booking_id: 51, user_id: 10 }
  },
  {
    id: 52,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "empty",
    time: "9h - 9h30",
    booking: {}
  },
  {
    id: 53,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "booked",
    time: "9h30 - 10h",
    booking: { booking_id: 53, user_id: 5 }
  },
  {
    id: 54,
    doctor_id: 1,
    date: "2023-03-06",
    type: "offline",
    status: "empty",
    time: "10h - 10h30",
    booking: {}
  },
  {
    id: 55,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "empty",
    time: "10h30 - 11h",
    booking: {}
  },
  {
    id: 56,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "empty",
    time: "11h - 11h30",
    booking: {}
  },
  {
    id: 57,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "waiting",
    time: "13h - 13h30",
    booking: { booking_id: 57, user_id: 6 }
  },
  {
    id: 58,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "booked",
    time: "13h30 - 14h",
    booking: { booking_id: 58, user_id: 3 }
  },
  {
    id: 59,
    doctor_id: 1,
    date: "2023-03-06",
    type: "offline",
    status: "booked",
    time: "14h - 14h30",
    booking: { booking_id: 59, user_id: 1 }
  },
  {
    id: 60,
    doctor_id: 1,
    date: "2023-03-06",
    type: "online",
    status: "waiting",
    time: "14h30 - 15h",
    booking: { booking_id: 60, user_id: 2 }
  },
  {
    id: 61,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "waiting",
    time: "15h - 15h30",
    booking: { booking_id: 61, user_id: 1 }
  },
  {
    id: 62,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "booked",
    time: "15h30 - 16h",
    booking: { booking_id: 62, user_id: 3 }
  },
  {
    id: 63,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "booked",
    time: "16h - 16h30",
    booking: { booking_id: 63, user_id: 8 }
  },
  {
    id: 64,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "empty",
    time: "",
    booking: {}
  },
  {
    id: 65,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "waiting",
    time: "7h30 - 8h",
    booking: { booking_id: 65, user_id: 4 }
  },
  {
    id: 66,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "empty",
    time: "8h - 8h30",
    booking: {}
  },
  {
    id: 67,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "empty",
    time: "8h30 - 9h",
    booking: {}
  },
  {
    id: 68,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "empty",
    time: "9h - 9h30",
    booking: {}
  },
  {
    id: 69,
    doctor_id: 1,
    date: "2023-03-07",
    type: "online",
    status: "empty",
    time: "9h30 - 10h",
    booking: {}
  },
  {
    id: 70,
    doctor_id: 1,
    date: "2023-03-07",
    type: "online",
    status: "waiting",
    time: "10h - 10h30",
    booking: { booking_id: 70, user_id: 1 }
  },
  {
    id: 71,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "waiting",
    time: "10h30 - 11h",
    booking: { booking_id: 71, user_id: 9 }
  },
  {
    id: 72,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "waiting",
    time: "11h - 11h30",
    booking: { booking_id: 72, user_id: 3 }
  },
  {
    id: 73,
    doctor_id: 1,
    date: "2023-03-07",
    type: "online",
    status: "waiting",
    time: "13h - 13h30",
    booking: { booking_id: 73, user_id: 1 }
  },
  {
    id: 74,
    doctor_id: 1,
    date: "2023-03-07",
    type: "offline",
    status: "booked",
    time: "13h30 - 14h",
    booking: { booking_id: 74, user_id: 3 }
  },
  {
    id: 75,
    doctor_id: 1,
    date: "2023-03-07",
    type: "online",
    status: "waiting",
    time: "14h - 14h30",
    booking: { booking_id: 75, user_id: 4 }
  },
  {
    id: 76,
    doctor_id: 1,
    date: "2023-03-08",
    type: "offline",
    status: "waiting",
    time: "14h30 - 15h",
    booking: { booking_id: 76, user_id: 9 }
  },
  {
    id: 77,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "booked",
    time: "15h - 15h30",
    booking: { booking_id: 77, user_id: 10 }
  },
  {
    id: 78,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "empty",
    time: "15h30 - 16h",
    booking: {}
  },
  {
    id: 79,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "empty",
    time: "16h - 16h30",
    booking: {}
  },
  {
    id: 80,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "waiting",
    time: "",
    booking: { booking_id: 80, user_id: 9 }
  },
  {
    id: 81,
    doctor_id: 1,
    date: "2023-03-08",
    type: "offline",
    status: "booked",
    time: "7h30 - 8h",
    booking: { booking_id: 81, user_id: 7 }
  },
  {
    id: 82,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "empty",
    time: "8h - 8h30",
    booking: {}
  },
  {
    id: 83,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "empty",
    time: "8h30 - 9h",
    booking: {}
  },
  {
    id: 84,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "empty",
    time: "9h - 9h30",
    booking: {}
  },
  {
    id: 85,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "booked",
    time: "9h30 - 10h",
    booking: { booking_id: 85, user_id: 10 }
  },
  {
    id: 86,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "booked",
    time: "10h - 10h30",
    booking: { booking_id: 86, user_id: 1 }
  },
  {
    id: 87,
    doctor_id: 1,
    date: "2023-03-08",
    type: "offline",
    status: "empty",
    time: "10h30 - 11h",
    booking: {}
  },
  {
    id: 88,
    doctor_id: 1,
    date: "2023-03-08",
    type: "offline",
    status: "waiting",
    time: "11h - 11h30",
    booking: { booking_id: 88, user_id: 2 }
  },
  {
    id: 89,
    doctor_id: 1,
    date: "2023-03-08",
    type: "online",
    status: "waiting",
    time: "13h - 13h30",
    booking: { booking_id: 89, user_id: 8 }
  },
  {
    id: 90,
    doctor_id: 1,
    date: "2023-03-08",
    type: "offline",
    status: "booked",
    time: "13h30 - 14h",
    booking: { booking_id: 90, user_id: 1 }
  },
  {
    id: 91,
    doctor_id: 1,
    date: "2023-03-09",
    type: "offline",
    status: "empty",
    time: "14h - 14h30",
    booking: {}
  },
  {
    id: 92,
    doctor_id: 1,
    date: "2023-03-09",
    type: "online",
    status: "booked",
    time: "14h30 - 15h",
    booking: { booking_id: 92, user_id: 9 }
  },
  {
    id: 93,
    doctor_id: 1,
    date: "2023-03-09",
    type: "offline",
    status: "empty",
    time: "15h - 15h30",
    booking: {}
  },
  {
    id: 94,
    doctor_id: 1,
    date: "2023-03-09",
    type: "offline",
    status: "booked",
    time: "15h30 - 16h",
    booking: { booking_id: 94, user_id: 1 }
  },
  {
    id: 95,
    doctor_id: 1,
    date: "2023-03-09",
    type: "online",
    status: "booked",
    time: "16h - 16h30",
    booking: { booking_id: 95, user_id: 9 }
  },
  {
    id: 96,
    doctor_id: 1,
    date: "2023-03-09",
    type: "online",
    status: "booked",
    time: "",
    booking: { booking_id: 96, user_id: 8 }
  },
  {
    id: 97,
    doctor_id: 1,
    date: "2023-03-09",
    type: "online",
    status: "waiting",
    time: "7h30 - 8h",
    booking: { booking_id: 97, user_id: 4 }
  },
  {
    id: 98,
    doctor_id: 1,
    date: "2023-03-09",
    type: "offline",
    status: "waiting",
    time: "8h - 8h30",
    booking: { booking_id: 98, user_id: 5 }
  },
  {
    id: 99,
    doctor_id: 1,
    date: "2023-03-09",
    type: "online",
    status: "waiting",
    time: "8h30 - 9h",
    booking: { booking_id: 99, user_id: 9 }
  },
  {
    id: 100,
    doctor_id: 1,
    date: "2023-03-09",
    type: "online",
    status: "booked",
    time: "9h - 9h30",
    booking: { booking_id: 100, user_id: 1 }
  }
];

const times = [
  {
    id: 1,
    name: "7h30 - 8h"
  },
  {
    id: 2,
    name: "8h - 8h30"
  },
  {
    id: 3,
    name: "8h30 - 9h"
  },
  {
    id: 4,
    name: "9h - 9h30"
  },
  {
    id: 5,
    name: "9h30 - 10h"
  },
  {
    id: 6,
    name: "10h - 10h30"
  },
  {
    id: 7,
    name: "10h30 - 11h"
  },
  {
    id: 8,
    name: "11h - 11h30"
  },
  {
    id: 9,
    name: "13h - 13h30"
  },
  {
    id: 10,
    name: "13h30 - 14h"
  },
  {
    id: 11,
    name: "14h - 14h30"
  },
  {
    id: 12,
    name: "14h30 - 15h"
  },
  {
    id: 13,
    name: "15h - 15h30"
  },
  {
    id: 14,
    name: "15h30 - 16h"
  },
  {
    id: 15,
    name: "16h - 16h30"
  }
];

const scheduleMockData = {
  list: () => schedules,
  detail: (index) => schedules[index],
  times: () => times
};

export default scheduleMockData;
