import { Telegraf, Markup } from 'telegraf'
require('dotenv').config()

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN ?? ''

const bot = new Telegraf(telegramBotToken)

type User = {
  id: number
  first_name: string
  username: string
}

const USERS: User[] = []

bot.start(async (ctx: any) => {
  console.log(ctx.update.message.from)
  const { id: userId } = ctx.update.message.from
  await ctx.reply('Секундочку...')
  const userRegistered: boolean = USERS.some((user: User) => user.id === userId)
  console.log(`User registered: ${userRegistered}`)

  if (userRegistered) {
    await ctx.reply(
      `Приветствую, ${userId}`,
      Markup.keyboard([
        [
          Markup.button.text('Заполнить анкету'),
          Markup.button.text('К админам'),
        ],
        [
          Markup.button.text('Посмотреть расписание'),
          Markup.button.text('Назад'),
        ],
      ])
    )
  } else {
    await ctx.reply(
      'Нужно зарегистрироваться',
      Markup.keyboard([Markup.button.text('Зарегистрироваться')])
    )
  }
})

bot.hears('Зарегистрироваться', async (ctx: any) => {
  const { id: userId, first_name, username } = ctx.update.message.from
  USERS.push({
    id: userId,
    first_name,
    username,
  })
})

bot.hears('Заполнить анкету', async (ctx: any) => {
  await ctx.reply('Анкета заполнена, спасибо!')
})

bot.hears('К админам', async (ctx: any) => {
  await ctx.reply(
    'Выбери тему',
    Markup.keyboard([
      [
        Markup.button.text('Исправить в расписании'),
        Markup.button.text('Другое'),
      ],
      [Markup.button.text('Назад')],
    ])
  )
})

bot.hears('Посмотреть расписание', (ctx: any) => {
  ctx.reply('Загружаем...')
  setTimeout(() => {
    ctx.replyWithMarkdown(`
• 01\.01 - Молодежное служение - Лид-гитара
• 08\.01 - Молодежное служение - Ритм-гитара
  `)
  }, 1000)
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
