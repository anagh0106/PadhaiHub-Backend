const zod = require("zod");

const CounterValidation = zod.object({
    counter: zod.number().max(1),
    email: zod.string().email()
});

module.exports = {
    CounterValidation
}
