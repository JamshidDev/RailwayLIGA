import {Tournament} from "../models/index.js"


const index = async(req,res)=>{
    try{
        let page = req.query.page || 1;
        let per_page = req.query?.per_page || 10;
        let sort =parseInt(req.query?.sort || 1);
        let search = req.query?.search || "";
        let totalItem = 0;

        totalItem = await Tournament.countDocuments({active:true, name: { $regex: search, $options: "i" },})
        let result = await Tournament.find({active:true, name: { $regex: search, $options: "i" },})
            .sort({'createdAt':sort })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .select('_id name photo teamCount from to')

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
        let { name,photo,teamCount,from,to} = req.body;
        await Tournament.create({
            name,
            teamCount,
            photo:photo || undefined,
            from,
            to,
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
        let {name,photo, teamCount, from, to} = req.body;
        let id = req.params.id;
        await Tournament.findByIdAndUpdate(id, {
            name,
            teamCount,
            photo:photo || undefined,
            from,
            to,
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
        const result = await Tournament.updateOne({
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






export const tournamentController = {store,index,update, remove}