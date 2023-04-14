import { defineAbility } from "@casl/ability";
import Staff, { staffRoles, staffActionAbility } from "../entities/Staff";
import User, { userActionAbility } from "../entities/User";
import { Expertise, expertiseActionAbility } from "../entities/Expertise";

const defineAbilityFor = (staff) => {
  const STAFF = Staff.magicWord();
  const USER = User.magicWord();
  const EXPERTISE = Expertise.magicWord();

  return defineAbility((can, cannot) => {
    const role = staff?.role;
    switch (role) {
      case staffRoles.ROLE_ADMIN:
        can("manage", "all");
        break;

      case staffRoles.ROLE_DOCTOR:
        // STAFF
        can(staffActionAbility.READ, STAFF);
        can(staffActionAbility.UPDATE, STAFF, {
          id: staff?.id
        });
        cannot(staffActionAbility.DELETE, STAFF);

        // EXPERTISE
        cannot(expertiseActionAbility.ADD, EXPERTISE);

        // can(["read"], ["Payment"]);

        // User
        can(userActionAbility.READ, USER);
        cannot(userActionAbility.DELETE, USER);

        break;

      case staffRoles.ROLE_NURSE:
        // cannot("manage", "Payment");

        break;

      case staffRoles.ROLE_CUSTOMER_SERVICE:
        // cannot("manage", "Payment");

        break;
      default:
        cannot("manage", "all");
        break;
    }
  });
};

export default defineAbilityFor;
