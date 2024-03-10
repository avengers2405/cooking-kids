// models represents data and business logic of application
// basically used for DB, and defines 'models' to store data, most commonly in MongoDB
// this will be used to do describe model of mongodb using mongoose that we will use here

import mongoose from 'mongoose';

//we can deirectly form schema in export object, but it is best to create it seperately

//these method of mongoose helps us create a schema
const userSchema = mongoose.Schema(
    {
        name :{ //defines fields
            type: String,
            required: true,
            default: "tourist",
        },
        rating: {
            type: Number,
            required: true,
            default: 3979,
        },
        rank: {
            type: String,
            required: true,
            default: "LGM",
        },
        problemsSolved: {
            type: Number,
            required: true,
            default: 2343,
        },
    },
    {
        timestamps: true, //records timestamps as well with records
    }
);

export const userData = mongoose.model('Data0', userSchema);
//exports model with name 'Data0', and schema userSchema defined above
