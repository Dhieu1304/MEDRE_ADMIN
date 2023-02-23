import { defineAbility } from "@casl/ability";

const defineAbilityFor = (user) =>
  defineAbility((can, cannot) => {
    const role = user?.role;
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
        cannot("manage", "all");
        break;
    }
  });

export default defineAbilityFor;
