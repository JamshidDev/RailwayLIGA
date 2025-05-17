import mongoose from "mongoose"


const teamSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    photo:{
        type:String,
        default:'default-team-logo.png'
    },
    active:{
        type:Boolean,
        default:true,
    },
    members:{
        type:Array,
        default:[]
    }
    }, {
    timestamps:true
    })

export const Team = mongoose.model('Team',teamSchema)