import {Match} from "../models/index.js"


const index = async(req,res)=>{
    try{
        let page = req.query.page || 1;
        let per_page = req.query?.per_page || 10;
        let sort =parseInt(req.query?.sort || 1);
        let search = req.query?.search || "";
        let isFinished = req.query?.isFinished || false;
        let totalItem = 0;

        totalItem = await Match.countDocuments({active:true, isFinished})
        let result = await Match.find({active:true, isFinished})
            .sort({'createdAt':sort })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .select('-active -createdAt -updatedAt -__v')
            .populate('leftTeamId', 'name _id photo')
            .populate('rightTeamId', 'name _id photo')

        res.status(200).json({
            success:true,
            data:{
                data:result,
                totalItem:totalItem
            },


        })
    }catch (error){
        console.log(error)
        res.status(500).json({
            success:false,
            message: error,
        })
    }
}

const store = async(req,res)=>{
    try{
        let { tournamentId,leftTeamId,rightTeamId,leftTeamScore,rightTeamScore, isFinished,time,description} = req.body;
         await Match.create({
            tournamentId,
            leftTeamId,
            rightTeamId,
            time,
            leftTeamScore:leftTeamScore || undefined,
            rightTeamScore:rightTeamScore || undefined,
            isFinished:isFinished || undefined,
            description:description || undefined,
        })
        res.status(200).json({
            success:true,
            message: "Successfully created",
        })
    }catch (error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

const update = async(req,res)=>{
    try{
        let {tournamentId,leftTeamId,rightTeamId,leftTeamScore,rightTeamScore, isFinished,time,description} = req.body;
        let id = req.params.id;
        await Match.findByIdAndUpdate(id, {
            tournamentId,
            leftTeamId,
            rightTeamId,
            time,
            leftTeamScore:leftTeamScore || undefined,
            rightTeamScore:rightTeamScore || undefined,
            isFinished:isFinished || undefined,
            description:description || undefined,
        });
        res.status(200).json({
            success:true,
            message: "Successfully updated",
        })
    }catch (error){
        console.log(error)
        res.status(500).json({
            success:false,
            message: error,
        })
    }
}

const remove = async(req,res)=>{
    try{
        let id =req.params.id;
        const result = await Match.updateOne({
            _id:id,
            active: true,
        }, {
            active: false,
        });

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Not fount Item',
            });
        }

        res.status(200).json({
            success:true,
            message: "Successfully delete",
        })

    }catch (error){
        console.log(error)
        res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}






export const matchController = {store,index,update, remove}

