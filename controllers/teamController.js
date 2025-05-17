import {Team} from "../models/index.js"


const index = async(req,res)=>{
    try{
        let page = req.query.page || 1;
        let per_page = req.query?.per_page || 10;
        let sort =parseInt(req.query?.sort || 1);
        let search = req.query?.search || "";
        let totalItem = 0;

        totalItem = await Team.countDocuments({active:true, name: { $regex: search, $options: "i" },})
        let result = await Team.find({active:true, name: { $regex: search, $options: "i" },})
            .sort({'createdAt':sort })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .select('_id name photo members')

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
        let { name,photo} = req.body;
        await Team.create({
            name,
            photo:photo || undefined
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
        let {name,photo} = req.body;
        let id = req.params.id;
        await Team.findByIdAndUpdate(id, {
            name,
            photo:photo || undefined,
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
        const result = await Team.updateOne({
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






export const teamController = {store,index,update, remove}