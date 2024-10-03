import { Composer,Keyboard } from "grammy"
const composer = new Composer();
import {createConversation} from "@grammyjs/conversations";
import channelControllers from "../controllers/channelControllers.js";
import requestController from "../controllers/requestController.js";
import {Menu} from "@grammyjs/menu";

const bot = composer.chatType("private");

const admin_buttons = new Keyboard()
    .text("⬇️ Kino yuklash")
    .text("⭐ Admin kanallar")
    .row()
    .text("✍️ Xabar yozish")
    .text("🔗 Link qo'shish")
    .row()
    .text("📈 Dashboard")
    .resized()





bot.use(createConversation(addLinkConversation))
bot.use(createConversation(adminChannelConversation))
bot.use(createConversation(removeAdminChannelConversation))
bot.use(createConversation(privateChannelLinkConversation))


const adminChannel = new Menu("adminChannel")
    .dynamic(async (ctx,range)=>{
        let list = await ctx.session.session_db.adminChannels
        list.forEach((item)=>{
            range
                .text(`${item.ad? '🟢' : '🟡'}  ${item.name}`, async (ctx)=>{
                    if(item.type ==='PrivateChannel' && item.link === null){
                            await ctx.answerCallbackQuery('No Link')
                    }else{
                        const result = await channelControllers.updateStatus(item.id, !item.ad)
                        if(result.success){
                            ctx.session.session_db.adminChannels = result.data.map((item)=>({
                                id:item._id,
                                name:item.title,
                                ad:item.ad,
                                link:item.channelLink,
                                type:item.type,
                            }))

                            await ctx.menu.update();


                        }
                    }

                })
                .row()
        })
    })
bot.use(adminChannel)

const removeAdminChannel = new Menu("removeAdminChannel")
    .dynamic(async (ctx,range)=>{
        let list = await ctx.session.session_db.adminChannels
        list.forEach((item, idx)=>{
            range
                .text(`🗑 ${item.ad? '🔻' : '◾️'}  ${item.name}`, async (ctx)=>{

                    const result = await channelControllers.removeChannel(item.id)
                    await requestController.deleteChannelRequest(item.channelId)
                    if(result.success && result.data.length>0){
                        ctx.session.session_db.adminChannels = result.data.map((item)=>({
                            id:item._id,
                            name:item.type==='PublicChannel'? item.title : item.channelLink,
                            ad:item.ad,
                            channelId:item.telegramId,
                        }))

                        await ctx.menu.update();
                    }else{
                        await ctx.reply("Kanal yo'q...")
                    }
                }).row()
        })

    })
bot.use(removeAdminChannel)

const privateChannelMenu = new Menu("privateChannelMenu")
    .dynamic(async (ctx,range)=>{
        let list = await ctx.session.session_db.adminChannels
        list.forEach((item, idx)=>{
            range
                .text(`${item.link? '🔗' : ''} ${item.name}`, async (ctx)=>{
                    ctx.session.session_db.selectedChannelId = item.id
                    await ctx.answerCallbackQuery()
                    await ctx.deleteMessage()
                    await ctx.conversation.enter("privateChannelLinkConversation");

                }).row()
        })

    })
bot.use(privateChannelMenu)










async function addLinkConversation(conversation, ctx){
    let data = {
        telegramId:null,
        userId:ctx.from.id,
        title:"Link",
        type:'Link',
        channelLink:null,
    }
    let keyboardBtn = new Keyboard()
        .text("🛑 Bekor qilish")
        .resized()
    await ctx.reply(`Linkni yuboring
    
Masalan: <i>https://timeweb.cloud.com</i>
    `, {
        reply_markup:keyboardBtn,
        parse_mode:"HTML"
    })
    ctx = await conversation.wait()

    if (!ctx.message?.text?.includes("http")) {
        do {
            await ctx.reply("⚠️ <b>Noto'g'ri ma'lumot</b>\n\n <i>Linkni yuboring!</i> ", {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text?.includes("http"));
    }

    data.channelLink = ctx.message.text
    const result = await channelControllers.store(data)

    if(result.success){
        await ctx.reply(`✅ Link muvofaqiyati qo'shildi`, {
            reply_markup:keyboardBtn,
            parse_mode:"HTML"
        })
        await ctx.reply(`⚡️ Asosy menyu ⚡️`,{
            reply_markup:admin_buttons
        })

    }else{
        await ctx.reply(`🤯 Kutilmagan xatolik yuz berdi`, {
            reply_markup:keyboardBtn,
            parse_mode:"HTML"
        })
    }




}

async function adminChannelConversation(conversation, ctx){
    ctx.session.session_db.adminChannels = []
        let list = await channelControllers.adminChannels()
        if(list.data.length === 0){
            await ctx.reply("☹️ Sizda admin kanallar yo'q", {
                reply_markup:admin_buttons,
            })


        }else{
            ctx.session.session_db.adminChannels = list.data.map((item)=>({
                id:item._id,
                name:item.type === 'Link'? item.channelLink:item.title,
                ad:item.ad,
                link:item.channelLink,
                type:item.type,
            }))

            await ctx.reply(`
<b>Admin kanallar</b>

🟢 Aktiv kanal
🟡 Passiv kanal

<i>Kerakli kanalni ustiga bosish orqali uning statusini teskari statusga o'zgartirasiz</i>

            `, {
                reply_markup:adminChannel,
                parse_mode:"HTML"
            })


        }

}

async function removeAdminChannelConversation(conversation, ctx){
    ctx.session.session_db.adminChannels = []
    let list = await channelControllers.adminChannels()
    if(list.data.length === 0){
        await ctx.reply("☹️ Sizda admin kanallar yo'q")

    }else{
        ctx.session.session_db.adminChannels = list.data.map((item)=>({
            id:item._id,
            name:item.type==='PublicChannel'? item.title : item.channelLink,
            ad:item.ad,
            channelId:item.telegramId,
        }))



        await ctx.reply("🗑 Kanal o'chirish", {
            reply_markup:removeAdminChannel,
            parse_mode:"HTML"
        })


    }

}

async function privateChannelLinkConversation(conversation, ctx){
    let keyboardBtn = new Keyboard()
        .text("🛑 Bekor qilish")
        .resized()
    await ctx.reply(`Kanalga qo'shilish linkini yuboring
    
Masalan: <i>https://t.me/+TKQnHeIZgb81YjVi</i>
    `, {
        reply_markup:keyboardBtn,
        parse_mode:"HTML"
    })

    ctx = await conversation.wait()
    if (!ctx.message?.text?.includes("https://t.me/")) {
        do {
            await ctx.reply("⚠️ <b>Noto'g'ri ma'lumot</b>\n\n <i>Linkni yuboring!</i> ", {
                parse_mode: "HTML",
            });
            ctx = await conversation.wait();
        } while (!ctx.message?.text?.includes("https://t.me/"));
    }
    let link = ctx.message.text
    let id = ctx.session.session_db.selectedChannelId

    let res = await channelControllers.updatePrivateChannelLink(id, link)
    await ctx.reply('✅ Chanelga link ulandi',{
        reply_markup:admin_buttons
    })
}



bot.hears("🔗 Link qo'shish", async (ctx)=>{
    const actionButton = new Keyboard()
        .text("➕ Link")
        .row()
        .text("➕ Private Link")
        .row()
        .text("🗑 Delete Channel")
        .row()
        .text("🛑 Bekor qilish")
        .resized()
    await ctx.reply("Link turini tanlang",{
        reply_markup:actionButton,
        parse_mode:"HTML"
    })
})
bot.hears("⭐ Admin kanallar", async (ctx)=>{
    await ctx.conversation.enter("adminChannelConversation");
})
bot.hears("➕ Link", async (ctx)=>{
    await ctx.conversation.enter("addLinkConversation");
})
bot.hears("🗑 Delete Channel", async (ctx)=>{
    await ctx.conversation.enter("removeAdminChannelConversation");
})
bot.hears("➕ Private Link", async (ctx)=>{
    let list = await channelControllers.privateChannels()
    if(list.data.length>0){
        ctx.session.session_db.adminChannels=[]
        ctx.session.session_db.adminChannels = list.data.map((item)=>({
            id:item._id,
            name:item.title,
            link:Boolean(item.channelLink)
        }))
        await ctx.reply('Kanalni tanlang', {
            reply_markup:privateChannelMenu,
            parse_mode:"HTML"
        })


    }else{
        await ctx.reply("☹️ Sizda admin kanallar yo'q")
    }
})

bot.command('privateLink', async(ctx)=>{
    // await ctx.conversation.enter("privateChannelLinkConversation");

    let list = await channelControllers.privateChannels()
    if(list.data.length>0){
        ctx.session.session_db.adminChannels=[]
        ctx.session.session_db.adminChannels = list.data.map((item)=>({
            id:item._id,
            name:item.title,
            link:Boolean(item.channelLink)
        }))
        await ctx.reply('Kanalni tanlang', {
            reply_markup:privateChannelMenu,
            parse_mode:"HTML"
        })


    }else{
        await ctx.reply("☹️ Sizda admin kanallar yo'q")
    }
})






export default bot;