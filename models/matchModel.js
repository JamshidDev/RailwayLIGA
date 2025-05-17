import mongoose, {Schema} from "mongoose"

const matchSchema = new mongoose.Schema({
    tournamentId:{
        type:Schema.Types.ObjectId,
        ref:'Tournament',
        required:true,
    },
    leftTeamId:{
        type:Schema.Types.ObjectId,
        ref:'Team',
        required:true,
    },
    rightTeamId:{
        type:Schema.Types.ObjectId,
        ref:'Team',
        required:true,
    },
    leftTeamScore:{
        type:Number,
        default:0,
    },
    rightTeamScore:{
        type:Number,
        default:0,
    },
    isFinished:{
        type:Boolean,
        default:false,
    },
    time:{
        type:Date,
        required:true,
        validate: {
            validator: function (value) {
                return !isNaN(Date.parse(value))
            },
            message: props => `'${props.value}' bu to‘g‘ri ISO sana emas!`
        }
    },
    description:{
        type:String,
        default:null,
    },

    active:{
        type:Boolean,
        default:true,
    }

},{
    timestamps: true,
})

export const Match = mongoose.model('Match',matchSchema)