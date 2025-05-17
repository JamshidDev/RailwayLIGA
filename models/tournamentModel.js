import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    photo:{
            type:String,
            default:'default-liga-logo.png',
        },
    teamCount:{
            type:Number,
            required:true,
        },
    from:{
        type:Date,
        required:true,
        validate: {
            validator: function (value) {
                return !isNaN(Date.parse(value))
            },
            message: props => `'${props.value}' bu to‘g‘ri ISO sana emas!`
        }
        },
    to:{
            type:Date,
            required:true,
            validate: {
                validator: function (value) {
                    return !isNaN(Date.parse(value))
                },
                message: props => `'${props.value}' bu to‘g‘ri ISO sana emas!`
            }
        },
        active:{
            type:Boolean,
            default:true,
        },
}, {timestamps: true}
)

export const Tournament = mongoose.model('Tournament', tournamentSchema)