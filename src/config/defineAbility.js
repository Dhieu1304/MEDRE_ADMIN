import { defineAbility } from "@casl/ability";

/*
 1: admin
 2: doctor
 3: staff
 4: customer care staff
*/

const defineAbilityFor = (user) =>
  defineAbility((can, cannot) => {
    const { role } = user;

    switch (role) {
      case "Admin":
        can("manage", "all");
        break;

      case "Doctor":
        can(["read"], ["Payment"]);
        cannot("manage", "Payment");
        break;

      case "User":
        cannot("manage", "Payment");

        break;
      default:
        break;
    }
  });

export default defineAbilityFor;
