import { defineAbility } from "@casl/ability";

/*
 1: admin
 2: doctor
 3: staff
 4: customer care staff
*/

const defineAbilityFor = (user) =>
    defineAbility((can, cannot) => {
        const { roleId } = user;
        console.log("roleId: ", roleId);

        switch (roleId) {
            // admin
            case 1:
                can("manage", "all");
                break;

            // doctor
            case 2:
                can(["read"], ["Patient"]);
                can(["read"], ["Booking"]);
                break;

            // staff
            case 3:
                can(["read", "update"], ["Patient"]);
                can(["read"], ["Booking"]);
                break;

            // customer care staff
            case 4:
                can(["read", "update", "write"], ["Booking"]);
                break;
            default:
                break;
        }
    });

export default defineAbilityFor;
