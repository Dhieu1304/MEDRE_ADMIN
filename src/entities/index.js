class Entity {
    constructor(attrs) {
        Object.assign(this, attrs);
    }
}

export class Patient extends Entity {}
export class Report extends Entity {}
export class Booking extends Entity {}
