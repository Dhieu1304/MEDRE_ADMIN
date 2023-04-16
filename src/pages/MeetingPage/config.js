// import jwtDecode from "jwt-decode";

// const data = {
//   createdAtTimeStamp: 1679887704357,
//   updatedAtTimeStamp: 1679887704407,
//   id: "deb8fc08-0106-40b9-8c50-57452887d5f1",
//   userId: "f569c202-7bbf-4620-af77-ecc1419a6b28",
//   scheduleDetailId: "7a7aad32-40b8-4ca7-ad73-fd069be592e5",
//   tutorMeetingLink:
//     "/call/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiZW1haWwiOiJ0ZWFjaGVyQGxldHR1dG9yLmNvbSIsIm5hbWUiOiJLZWVnYW4ifX0sInJvb20iOiJmNTY5YzIwMi03YmJmLTQ2MjAtYWY3Ny1lY2MxNDE5YTZiMjgtNGQ1NGQzZDctZDJhOS00MmU1LTk3YTItNWVkMzhhZjU3ODlhIiwicm9vbU5hbWUiOiJmNTY5YzIwMi03YmJmLTQ2MjAtYWY3Ny1lY2MxNDE5YTZiMjgtNGQ1NGQzZDctZDJhOS00MmU1LTk3YTItNWVkMzhhZjU3ODlhIiwidXNlckNhbGwiOnsiaWQiOiJmNTY5YzIwMi03YmJmLTQ2MjAtYWY3Ny1lY2MxNDE5YTZiMjgiLCJlbWFpbCI6InN0dWRlbnRAbGV0dHV0b3IuY29tIiwibmFtZSI6IlBoaGFpICIsImF2YXRhciI6Imh0dHBzOi8vc2FuZGJveC5hcGkubGV0dHV0b3IuY29tL2F2YXRhci9mNTY5YzIwMi03YmJmLTQ2MjAtYWY3Ny1lY2MxNDE5YTZiMjhhdmF0YXIxNjczNzE4NzU4MDkzLmpwZyIsImNvdW50cnkiOiJGUiIsInBob25lIjoiODQyNDk5OTk2NTA4IiwibGFuZ3VhZ2UiOiJBbGJhbmlhbiIsImJpcnRoZGF5IjoiMjAwMC0wMS0xMyIsImlzQWN0aXZhdGVkIjp0cnVlLCJyZXF1aXJlTm90ZSI6IiIsImxldmVsIjoiSElHSEVSX0JFR0lOTkVSIiwiaXNQaG9uZUFjdGl2YXRlZCI6dHJ1ZSwidGltZXpvbmUiOjcsInN0dWR5U2NoZWR1bGUiOiJUaOG7qSAyIDMgIiwiY2FuU2VuZE1lc3NhZ2UiOmZhbHNlfSwidXNlckJlQ2FsbGVkIjp7ImlkIjoiNGQ1NGQzZDctZDJhOS00MmU1LTk3YTItNWVkMzhhZjU3ODlhIiwiZW1haWwiOiJ0ZWFjaGVyQGxldHR1dG9yLmNvbSIsIm5hbWUiOiJLZWVnYW4iLCJhdmF0YXIiOiJodHRwczovL2FwaS5hcHAubGV0dHV0b3IuY29tL2F2YXRhci80ZDU0ZDNkNy1kMmE5LTQyZTUtOTdhMi01ZWQzOGFmNTc4OWFhdmF0YXIxNjI3OTEzMDE1ODUwLjAwIiwiY291bnRyeSI6IlZOIiwicGhvbmUiOiI4NDM1NjAzMDg3NiIsImxhbmd1YWdlIjoiVWtyYWluaWFuIiwiYmlydGhkYXkiOiIxOTk5LTA2LTA3IiwiaXNBY3RpdmF0ZWQiOnRydWUsInR1dG9ySW5mbyI6eyJpZCI6IjZjYTVjMDkyLTc2ZWEtNGU3Mi05YzZlLTA1ZTIyMzlhYTMzYiIsInVzZXJJZCI6IjRkNTRkM2Q3LWQyYTktNDJlNS05N2EyLTVlZDM4YWY1Nzg5YSIsInZpZGVvIjoiaHR0cHM6Ly9hcGkuYXBwLmxldHR1dG9yLmNvbS92aWRlby80ZDU0ZDNkNy1kMmE5LTQyZTUtOTdhMi01ZWQzOGFmNTc4OWF2aWRlbzE2Mjc5MTMwMTU4NzEubXA0IiwiYmlvIjoiSSBhbSBwYXNzaW9uYXRlIGFib3V0IHJ1bm5pbmcgYW5kIGZpdG5lc3MsIEkgb2Z0ZW4gY29tcGV0ZSBpbiB0cmFpbC9tb3VudGFpbiBydW5uaW5nIGV2ZW50cyBhbmQgSSBsb3ZlIHB1c2hpbmcgbXlzZWxmLiBJIGFtIHRyYWluaW5nIHRvIG9uZSBkYXkgdGFrZSBwYXJ0IGluIHVsdHJhLWVuZHVyYW5jZSBldmVudHMuIEkgYWxzbyBlbmpveSB3YXRjaGluZyBydWdieSBvbiB0aGUgd2Vla2VuZHMsIHJlYWRpbmcgYW5kIHdhdGNoaW5nIHBvZGNhc3RzIG9uIFlvdXR1YmUuIE15IG1vc3QgbWVtb3JhYmxlIGxpZmUgZXhwZXJpZW5jZSB3b3VsZCBiZSBsaXZpbmcgaW4gYW5kIHRyYXZlbGluZyBhcm91bmQgU291dGhlYXN0IEFzaWEuIiwiZWR1Y2F0aW9uIjoiQkEiLCJleHBlcmllbmNlIjoiSSBoYXZlIG1vcmUgdGhhbiAxMCB5ZWFycyBvZiB0ZWFjaGluZyBlbmdsaXNoIGV4cGVyaWVuY2UiLCJwcm9mZXNzaW9uIjoiRW5nbGlzaCB0ZWFjaGVyIiwiYWNjZW50IjpudWxsLCJ0YXJnZXRTdHVkZW50IjoiQWR2YW5jZWQiLCJpbnRlcmVzdHMiOiIgSSBsb3ZlZCB0aGUgd2VhdGhlciwgdGhlIHNjZW5lcnkgYW5kIHRoZSBsYWlkLWJhY2sgbGlmZXN0eWxlIG9mIHRoZSBsb2NhbHMuIiwibGFuZ3VhZ2VzIjoiZW4iLCJzcGVjaWFsdGllcyI6ImJ1c2luZXNzLWVuZ2xpc2gsY29udmVyc2F0aW9uYWwtZW5nbGlzaCxlbmdsaXNoLWZvci1raWRzLGllbHRzLHRvZWljIiwicmVzdW1lIjpudWxsLCJyYXRpbmciOjQuMjI3MjcyNzI3MjcyNzI3NSwiaXNBY3RpdmF0ZWQiOnRydWUsImlzTmF0aXZlIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIxLTA4LTAyVDE0OjAzOjM2LjMyMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAyLTE5VDA2OjA2OjU5LjQ0NFoifSwicmVxdWlyZU5vdGUiOm51bGwsImxldmVsIjoiUFJPRklDSUVOQ1kiLCJpc1Bob25lQWN0aXZhdGVkIjpudWxsLCJ0aW1lem9uZSI6Nywic3R1ZHlTY2hlZHVsZSI6IiIsImNhblNlbmRNZXNzYWdlIjpmYWxzZX0sImlzVHV0b3IiOnRydWUsInN0YXJ0VGltZSI6MTY4MDAyMjgwMDAwMCwiZW5kU2Vzc2lvbiI6MTY4MDAyNDMwMDAwMCwidGltZUluUm9vbSI6MTgwMCwiYm9va2luZ0lkIjoiZGViOGZjMDgtMDEwNi00MGI5LThjNTAtNTc0NTI4ODdkNWYxIiwiaWF0IjoxNjc5ODg3NzA0LCJleHAiOjE2ODAwMzg2OTksImF1ZCI6ImxpdmV0dXRvciIsImlzcyI6ImxpdmV0dXRvciIsInN1YiI6Imh0dHBzOi8vbWVldC50dXRvcmluZy5sZXRzdHVkeS5pbyJ9.I8EjKg_OLWiiyDzVhnRPRAkbl7LY3WNYIqG9RKNZ3gQ",
//   studentMeetingLink:
//     "/call/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiZW1haWwiOiJzdHVkZW50QGxldHR1dG9yLmNvbSIsIm5hbWUiOiJQaGhhaSAifX0sInJvb20iOiJmNTY5YzIwMi03YmJmLTQ2MjAtYWY3Ny1lY2MxNDE5YTZiMjgtNGQ1NGQzZDctZDJhOS00MmU1LTk3YTItNWVkMzhhZjU3ODlhIiwicm9vbU5hbWUiOiJmNTY5YzIwMi03YmJmLTQ2MjAtYWY3Ny1lY2MxNDE5YTZiMjgtNGQ1NGQzZDctZDJhOS00MmU1LTk3YTItNWVkMzhhZjU3ODlhIiwidXNlckNhbGwiOnsiaWQiOiJmNTY5YzIwMi03YmJmLTQ2MjAtYWY3Ny1lY2MxNDE5YTZiMjgiLCJlbWFpbCI6InN0dWRlbnRAbGV0dHV0b3IuY29tIiwibmFtZSI6IlBoaGFpICIsImF2YXRhciI6Imh0dHBzOi8vc2FuZGJveC5hcGkubGV0dHV0b3IuY29tL2F2YXRhci9mNTY5YzIwMi03YmJmLTQ2MjAtYWY3Ny1lY2MxNDE5YTZiMjhhdmF0YXIxNjczNzE4NzU4MDkzLmpwZyIsImNvdW50cnkiOiJGUiIsInBob25lIjoiODQyNDk5OTk2NTA4IiwibGFuZ3VhZ2UiOiJBbGJhbmlhbiIsImJpcnRoZGF5IjoiMjAwMC0wMS0xMyIsImlzQWN0aXZhdGVkIjp0cnVlLCJyZXF1aXJlTm90ZSI6IiIsImxldmVsIjoiSElHSEVSX0JFR0lOTkVSIiwiaXNQaG9uZUFjdGl2YXRlZCI6dHJ1ZSwidGltZXpvbmUiOjcsInN0dWR5U2NoZWR1bGUiOiJUaOG7qSAyIDMgIiwiY2FuU2VuZE1lc3NhZ2UiOmZhbHNlfSwidXNlckJlQ2FsbGVkIjp7ImlkIjoiNGQ1NGQzZDctZDJhOS00MmU1LTk3YTItNWVkMzhhZjU3ODlhIiwiZW1haWwiOiJ0ZWFjaGVyQGxldHR1dG9yLmNvbSIsIm5hbWUiOiJLZWVnYW4iLCJhdmF0YXIiOiJodHRwczovL2FwaS5hcHAubGV0dHV0b3IuY29tL2F2YXRhci80ZDU0ZDNkNy1kMmE5LTQyZTUtOTdhMi01ZWQzOGFmNTc4OWFhdmF0YXIxNjI3OTEzMDE1ODUwLjAwIiwiY291bnRyeSI6IlZOIiwicGhvbmUiOiI4NDM1NjAzMDg3NiIsImxhbmd1YWdlIjoiVWtyYWluaWFuIiwiYmlydGhkYXkiOiIxOTk5LTA2LTA3IiwiaXNBY3RpdmF0ZWQiOnRydWUsInR1dG9ySW5mbyI6eyJpZCI6IjZjYTVjMDkyLTc2ZWEtNGU3Mi05YzZlLTA1ZTIyMzlhYTMzYiIsInVzZXJJZCI6IjRkNTRkM2Q3LWQyYTktNDJlNS05N2EyLTVlZDM4YWY1Nzg5YSIsInZpZGVvIjoiaHR0cHM6Ly9hcGkuYXBwLmxldHR1dG9yLmNvbS92aWRlby80ZDU0ZDNkNy1kMmE5LTQyZTUtOTdhMi01ZWQzOGFmNTc4OWF2aWRlbzE2Mjc5MTMwMTU4NzEubXA0IiwiYmlvIjoiSSBhbSBwYXNzaW9uYXRlIGFib3V0IHJ1bm5pbmcgYW5kIGZpdG5lc3MsIEkgb2Z0ZW4gY29tcGV0ZSBpbiB0cmFpbC9tb3VudGFpbiBydW5uaW5nIGV2ZW50cyBhbmQgSSBsb3ZlIHB1c2hpbmcgbXlzZWxmLiBJIGFtIHRyYWluaW5nIHRvIG9uZSBkYXkgdGFrZSBwYXJ0IGluIHVsdHJhLWVuZHVyYW5jZSBldmVudHMuIEkgYWxzbyBlbmpveSB3YXRjaGluZyBydWdieSBvbiB0aGUgd2Vla2VuZHMsIHJlYWRpbmcgYW5kIHdhdGNoaW5nIHBvZGNhc3RzIG9uIFlvdXR1YmUuIE15IG1vc3QgbWVtb3JhYmxlIGxpZmUgZXhwZXJpZW5jZSB3b3VsZCBiZSBsaXZpbmcgaW4gYW5kIHRyYXZlbGluZyBhcm91bmQgU291dGhlYXN0IEFzaWEuIiwiZWR1Y2F0aW9uIjoiQkEiLCJleHBlcmllbmNlIjoiSSBoYXZlIG1vcmUgdGhhbiAxMCB5ZWFycyBvZiB0ZWFjaGluZyBlbmdsaXNoIGV4cGVyaWVuY2UiLCJwcm9mZXNzaW9uIjoiRW5nbGlzaCB0ZWFjaGVyIiwiYWNjZW50IjpudWxsLCJ0YXJnZXRTdHVkZW50IjoiQWR2YW5jZWQiLCJpbnRlcmVzdHMiOiIgSSBsb3ZlZCB0aGUgd2VhdGhlciwgdGhlIHNjZW5lcnkgYW5kIHRoZSBsYWlkLWJhY2sgbGlmZXN0eWxlIG9mIHRoZSBsb2NhbHMuIiwibGFuZ3VhZ2VzIjoiZW4iLCJzcGVjaWFsdGllcyI6ImJ1c2luZXNzLWVuZ2xpc2gsY29udmVyc2F0aW9uYWwtZW5nbGlzaCxlbmdsaXNoLWZvci1raWRzLGllbHRzLHRvZWljIiwicmVzdW1lIjpudWxsLCJyYXRpbmciOjQuMjI3MjcyNzI3MjcyNzI3NSwiaXNBY3RpdmF0ZWQiOnRydWUsImlzTmF0aXZlIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIxLTA4LTAyVDE0OjAzOjM2LjMyMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAyLTE5VDA2OjA2OjU5LjQ0NFoifSwicmVxdWlyZU5vdGUiOm51bGwsImxldmVsIjoiUFJPRklDSUVOQ1kiLCJpc1Bob25lQWN0aXZhdGVkIjpudWxsLCJ0aW1lem9uZSI6Nywic3R1ZHlTY2hlZHVsZSI6IiIsImNhblNlbmRNZXNzYWdlIjpmYWxzZX0sImlzVHV0b3IiOmZhbHNlLCJzdGFydFRpbWUiOjE2ODAwMjI4MDAwMDAsImVuZFNlc3Npb24iOjE2ODAwMjQzMDAwMDAsInRpbWVJblJvb20iOjE4MDAsImJvb2tpbmdJZCI6ImRlYjhmYzA4LTAxMDYtNDBiOS04YzUwLTU3NDUyODg3ZDVmMSIsImlhdCI6MTY3OTg4NzcwNCwiZXhwIjoxNjgwMDM4Njk5LCJhdWQiOiJsaXZldHV0b3IiLCJpc3MiOiJsaXZldHV0b3IiLCJzdWIiOiJodHRwczovL21lZXQudHV0b3JpbmcubGV0c3R1ZHkuaW8ifQ.hDfA0qvjfQqJ2vMU8R-WSbiak6X-wtD8c2OJxQ2j5ps",
//   studentRequest: null,
//   tutorReview: null,
//   scoreByTutor: null,
//   createdAt: "2023-03-27T03:28:24.357Z",
//   updatedAt: "2023-03-27T03:28:24.407Z",
//   recordUrl: null,
//   cancelReasonId: null,
//   lessonPlanId: null,
//   cancelNote: null,
//   calendarId: null,
//   isDeleted: false,
//   scheduleDetailInfo: {
//     startPeriodTimestamp: 1680022800000,
//     endPeriodTimestamp: 1680024300000,
//     id: "7a7aad32-40b8-4ca7-ad73-fd069be592e5",
//     scheduleId: "b9478c1c-618e-4390-8e2b-50cf3b10778c",
//     startPeriod: "17:00",
//     endPeriod: "17:25",
//     createdAt: "2023-03-27T03:28:11.169Z",
//     updatedAt: "2023-03-27T03:28:11.169Z",
//     scheduleInfo: {
//       date: "2023-03-28",
//       startTimestamp: 1680022800000,
//       endTimestamp: 1680024300000,
//       id: "b9478c1c-618e-4390-8e2b-50cf3b10778c",
//       tutorId: "4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
//       startTime: "17:00",
//       endTime: "17:25",
//       isDeleted: false,
//       createdAt: "2023-03-27T03:28:11.162Z",
//       updatedAt: "2023-03-27T03:28:11.162Z",
//       tutorInfo: {
//         id: "4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
//         level: "PROFICIENCY",
//         email: "teacher@lettutor.com",
//         google: null,
//         facebook: null,
//         apple: null,
//         avatar: "https://api.app.lettutor.com/avatar/4d54d3d7-d2a9-42e5-97a2-5ed38af5789aavatar1627913015850.00",
//         name: "Keegan",
//         country: "VN",
//         phone: "84356030876",
//         language: "Ukrainian",
//         birthday: "1999-06-07",
//         requestPassword: true,
//         isActivated: true,
//         isPhoneActivated: null,
//         requireNote: null,
//         timezone: 7,
//         phoneAuth: null,
//         isPhoneAuthActivated: false,
//         studySchedule: "",
//         canSendMessage: false,
//         isPublicRecord: false,
//         caredByStaffId: null,
//         createdAt: "2021-08-02T13:59:37.290Z",
//         updatedAt: "2023-03-17T07:16:23.143Z",
//         deletedAt: null,
//         studentGroupId: null
//       }
//     }
//   },
//   classReview: null,
//   showRecordUrl: false,
//   studentMaterials: [],
//   feedbacks: []
// };

// const userToken = data.studentMeetingLink.split("token=")[1];
// const doctorToken = data.tutorMeetingLink.split("token=")[1];

// // console.log("userToken: ", userToken);
// // console.log("doctorToken: ", doctorToken);

// const a = jwtDecode(userToken);
// const b = jwtDecode(doctorToken);

// console.log("a: ", a);
// console.log("b: ", b);

// // export const doctorDecoded = jwtDecode(data.s)

const userDecoded = {
  context: {
    user: {
      email: "student@lettutor.com",
      name: "Phhai "
    }
  },
  room: "f569c202-7bbf-4620-af77-ecc1419a6b28-4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
  roomName: "f569c202-7bbf-4620-af77-ecc1419a6b28-4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
  userCall: {
    id: "f569c202-7bbf-4620-af77-ecc1419a6b28",
    email: "student@lettutor.com",
    name: "Phhai ",
    avatar: "https://sandbox.api.lettutor.com/avatar/f569c202-7bbf-4620-af77-ecc1419a6b28avatar1673718758093.jpg",
    country: "FR",
    phone: "842499996508",
    language: "Albanian",
    birthday: "2000-01-13",
    isActivated: true,
    requireNote: "",
    level: "HIGHER_BEGINNER",
    isPhoneActivated: true,
    timezone: 7,
    studySchedule: "Thứ 2 3 ",
    canSendMessage: false
  },
  userBeCalled: {
    id: "4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
    email: "teacher@lettutor.com",
    name: "Keegan",
    avatar: "https://api.app.lettutor.com/avatar/4d54d3d7-d2a9-42e5-97a2-5ed38af5789aavatar1627913015850.00",
    country: "VN",
    phone: "84356030876",
    language: "Ukrainian",
    birthday: "1999-06-07",
    isActivated: true,
    tutorInfo: {
      id: "6ca5c092-76ea-4e72-9c6e-05e2239aa33b",
      userId: "4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
      video: "https://api.app.lettutor.com/video/4d54d3d7-d2a9-42e5-97a2-5ed38af5789avideo1627913015871.mp4",
      bio: "I am passionate about running and fitness, I often compete in trail/mountain running events and I love pushing myself. I am training to one day take part in ultra-endurance events. I also enjoy watching rugby on the weekends, reading and watching podcasts on Youtube. My most memorable life experience would be living in and traveling around Southeast Asia.",
      education: "BA",
      experience: "I have more than 10 years of teaching english experience",
      profession: "English teacher",
      accent: null,
      targetStudent: "Advanced",
      interests: " I loved the weather, the scenery and the laid-back lifestyle of the locals.",
      languages: "en",
      specialties: "business-english,conversational-english,english-for-kids,ielts,toeic",
      resume: null,
      rating: 4.2272727272727275,
      isActivated: true,
      isNative: null,
      createdAt: "2021-08-02T14:03:36.320Z",
      updatedAt: "2023-02-19T06:06:59.444Z"
    },
    requireNote: null,
    level: "PROFICIENCY",
    isPhoneActivated: null,
    timezone: 7,
    studySchedule: "",
    canSendMessage: false
  },
  isTutor: false,
  startTime: 1680022800000,
  endSession: 1680024300000,
  timeInRoom: 1800,
  bookingId: "deb8fc08-0106-40b9-8c50-57452887d5f1",
  iat: 1679887704,
  exp: 1680038699,
  aud: "livetutor",
  iss: "livetutor",
  sub: "https://meet.tutoring.letstudy.io"
};

const teacherDecoded = {
  context: {
    user: {
      email: "teacher@lettutor.com",
      name: "Keegan"
    }
  },
  room: "f569c202-7bbf-4620-af77-ecc1419a6b28-4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
  roomName: "f569c202-7bbf-4620-af77-ecc1419a6b28-4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
  userCall: {
    id: "f569c202-7bbf-4620-af77-ecc1419a6b28",
    email: "student@lettutor.com",
    name: "Phhai ",
    avatar: "https://sandbox.api.lettutor.com/avatar/f569c202-7bbf-4620-af77-ecc1419a6b28avatar1673718758093.jpg",
    country: "FR",
    phone: "842499996508",
    language: "Albanian",
    birthday: "2000-01-13",
    isActivated: true,
    requireNote: "",
    level: "HIGHER_BEGINNER",
    isPhoneActivated: true,
    timezone: 7,
    studySchedule: "Thứ 2 3 ",
    canSendMessage: false
  },
  userBeCalled: {
    id: "4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
    email: "teacher@lettutor.com",
    name: "Keegan",
    avatar: "https://api.app.lettutor.com/avatar/4d54d3d7-d2a9-42e5-97a2-5ed38af5789aavatar1627913015850.00",
    country: "VN",
    phone: "84356030876",
    language: "Ukrainian",
    birthday: "1999-06-07",
    isActivated: true,
    tutorInfo: {
      id: "6ca5c092-76ea-4e72-9c6e-05e2239aa33b",
      userId: "4d54d3d7-d2a9-42e5-97a2-5ed38af5789a",
      video: "https://api.app.lettutor.com/video/4d54d3d7-d2a9-42e5-97a2-5ed38af5789avideo1627913015871.mp4",
      bio: "I am passionate about running and fitness, I often compete in trail/mountain running events and I love pushing myself. I am training to one day take part in ultra-endurance events. I also enjoy watching rugby on the weekends, reading and watching podcasts on Youtube. My most memorable life experience would be living in and traveling around Southeast Asia.",
      education: "BA",
      experience: "I have more than 10 years of teaching english experience",
      profession: "English teacher",
      accent: null,
      targetStudent: "Advanced",
      interests: " I loved the weather, the scenery and the laid-back lifestyle of the locals.",
      languages: "en",
      specialties: "business-english,conversational-english,english-for-kids,ielts,toeic",
      resume: null,
      rating: 4.2272727272727275,
      isActivated: true,
      isNative: null,
      createdAt: "2021-08-02T14:03:36.320Z",
      updatedAt: "2023-02-19T06:06:59.444Z"
    },
    requireNote: null,
    level: "PROFICIENCY",
    isPhoneActivated: null,
    timezone: 7,
    studySchedule: "",
    canSendMessage: false
  },
  isTutor: true,
  startTime: 1680022800000,
  endSession: 1680024300000,
  timeInRoom: 1800,
  bookingId: "deb8fc08-0106-40b9-8c50-57452887d5f1",
  iat: 1679887704,
  exp: 1680038699,
  aud: "livetutor",
  iss: "livetutor",
  sub: "https://meet.tutoring.letstudy.io"
};

export { userDecoded, teacherDecoded };
