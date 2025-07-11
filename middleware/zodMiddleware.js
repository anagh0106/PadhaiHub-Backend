const UserValidation = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    } catch (err) {
        res.status(404).json({
            message: err
        })
    }
}

const UserValidation1 = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync(req.body);  // ✅ Only body pass karna hai
        next();
    } catch (err) {
        res.status(400).json({
            message: err.errors  // ✅ Zod errors array deta hai
        });
    }
}

module.exports = {
    UserValidation,
    UserValidation1
}