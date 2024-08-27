import {Composer, Keyboard} from "grammy"
import channelControllers from "../controllers/channelControllers.js";
import userControllers from "../controllers/userControllers.js";

const bot = new Composer();



bot.command('start', async (ctx)=>{
    let data = {
        telegramId:ctx.from.id,
        firstname:ctx.from.first_name,
        lastname:ctx.from?.last_name,
        username:ctx.from?.username,
        languageCode:ctx.from.language_code,
        active:true,
    }
     await userControllers.store(data)
    if(!ctx.config?.superAdmin){
        await ctx.reply(`
👋 Salom [${ctx.from.first_name}](tg://user?id=${ctx.from.id})

_Menga kino kodini yuboring!_
    `,{
            parse_mode:"Markdown",
            reply_markup:{
                remove_keyboard:true,
            }
        })
    }
    else{

        const admin_buttons = new Keyboard()
            .text("⬇️ Kino yuklash")
            .text("⭐ Admin kanallar")
            .row()
            .text("✍️ Xabar yozish")
            .text("🔗 Link qo'shish")
            .row()
            .text("📈 Dashboard")
            .resized()

        await ctx.reply(`⚡️ Asosy menyu ⚡️`,{
            reply_markup:admin_buttons
        })
    }

})




bot.on("my_chat_member", async (ctx) => {
    const status = ctx.update.my_chat_member.new_chat_member.status;
    const type = ctx.update.my_chat_member.chat.type;
    if(type === 'channel'){
        if(status === 'administrator'){
            let data = {
                telegramId: ctx.update.my_chat_member.chat.id,
                userId: ctx.update.my_chat_member.from.id,
                title: ctx.update.my_chat_member.chat.title,
                username: ctx.update.my_chat_member.chat.username,
                type: ctx.update.my_chat_member.chat.type,
                newChat: ctx.update.my_chat_member.new_chat_member,
            }
            await channelControllers.store(data)
        }else{
            // status is left or member
            let telegram_id = ctx.update.my_chat_member.chat.id;
            await channelControllers.remove(telegram_id)
        }
    }
    else if(type === 'private'){
        if(status ==='kicked'){
            const stats = await ctx.conversation.active();
            for (let key of Object.keys(stats)) {
                await ctx.conversation.exit(key);
            }
            await userControllers.remove(ctx.from.id)
        }else{
            //     status is member
            let data = {
                telegramId:ctx.from.id,
                firstname:ctx.from.first_name,
                lastname:ctx.from?.last_name,
                username:ctx.from?.username,
                languageCode:ctx.from.language_code,
                active:true,
            }
            await userControllers.store(data)
        }
    }
});








export default bot;