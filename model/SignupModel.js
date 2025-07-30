// const mongoose = require("mongoose");
// const schema = mongoose.Schema;
// const AutoIncrement = require("mongoose-sequence")(mongoose);

// const SignupSchema = new schema({
//     username: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     MotherboardID: {
//         type: String,
//         default: null,
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'user'],
//         default: 'user',
//     },
//     admissionYear: String,
//     studentId: { type: String, unique: true, sparse: true },
//     studentSeq: {
//         type: Number,
//         unique: true,
//     },
// }, {
//     timestamps: true,
// });

const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const SignupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // ✅ Ensures no duplicate users
    },
    password: {
        type: String,
        required: true,
    },
    MotherboardID: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    admissionYear: String,

    // Auto-generated fields:
    studentId: {
        type: String,
        unique: true,
        sparse: true // ✅ Avoids false duplicate error if null
    },

    studentSeq: {
        type: Number,
        unique: true // ✅ This is auto-incremented
    }
}, {
    timestamps: true,
    autoIndex: false // 🔥 Prevents auto-creating indexes unless explicitly defined
});


// SignupSchema.plugin(AutoIncrement,
//     {
//         id: "student_counter",
//         inc_field: "studentSeq"
//     }
// );
SignupSchema.plugin(AutoIncrement,
    {
        id: "student_counter",
        inc_field: "studentSeq",
    }
);

SignupSchema.index({ email: 1 }, { unique: true });
SignupSchema.index({ studentSeq: 1 }, { unique: true });
SignupSchema.index({ studentId: 1 }, { unique: true, sparse: true });


module.exports = mongoose.model("SignUp", SignupSchema);


// const mongoose = require("mongoose");
// const schema = mongoose.Schema;
// const AutoIncrement = require("mongoose-sequence")(mongoose);

// const SignupSchema = new schema({
//     username: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     MotherboardID: {
//         type: String,
//         default: null,
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'user'],
//         default: 'user',
//     },
//     admissionYear: String,
//     studentSeq: {
//         type: Number
//     },
//     studentId: {
//         type: String,
//         unique: true
//     },
// }, {
//     timestamps: true,
// });

// // Auto-increment plugin for studentSeq
// SignupSchema.plugin(AutoIncrement, { inc_field: "studentSeq" });

// // Hook to auto-generate studentId after getting studentSeq
// SignupSchema.pre("save", function (next) {
//     if (!this.studentId && this.admissionYear && this.studentSeq) {
//         this.studentId = `STU-100-${this.admissionYear}${this.studentSeq}`;
//     }
//     next();
// });

// module.exports = mongoose.model("SignUp", SignupSchema);


// const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-auto-increment");

// const connection = mongoose.createConnection(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Initialize auto-increment
// // AutoIncrement.initialize(connection);
// AutoIncrement.initialize(mongoose.connection);
// const schema = mongoose.Schema;

// const SignupSchema = new schema({
//     username: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     MotherboardID: {
//         type: String,
//         default: null,
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'user'],
//         default: 'user',
//     },
//     admissionYear: String,
//     studentSeq: {
//         type: Number,
//     },
//     studentId: {
//         type: String,
//         unique: true
//     },
// }, {
//     timestamps: true,
// });

// // Auto-increment plugin for studentSeq
// SignupSchema.plugin(AutoIncrement.plugin, {
//     model: "SignUp",
//     field: "studentSeq",
//     startAt: 1,
//     incrementBy: 1
// });

// // Hook to generate studentId
// SignupSchema.pre("save", function (next) {
//     if (!this.studentId && this.admissionYear && this.studentSeq) {
//         this.studentId = `STU-100-${this.admissionYear}${this.studentSeq}`;
//     }
//     next();
// });

// module.exports = connection.model("SignUp", SignupSchema);
