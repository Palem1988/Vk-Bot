const vk = require('vk-chat-bot') // vk-chat-bot library
const moment = require('moment') // For easy time formatting
const state = require('./state')

var params = {
  vk_token: process.env.VK_API_KEY, // VK API token
  confirmation_token: process.env.CONFIRMATION_TOKEN, // Can be found in group Callback API settings
  group_id: process.env.GROUP_ID, // Can be found in group Callback API settings
  secret: process.env.SECRET, // Secret key, set it in group Callback API settings
  port: process.env.PORT, // Port to run the bot at

  cmd_prefix: process.env.CMD_PREFIX // Command prefix, optional
}

var {bot, core} = vk.bot(params) // Create the bot

core.on('message_edit', $ => {
  $.text('You edited a message, now it looks like this: ' + $.msg)
})

// If cmd_prefix is "/", we search for "/help" in the beginning of the message
core.cmd('help', $ => {
  // core.help() returns the full help message
  $.text('Test Bot v1.0' + core.help())

  // Attach a nice image from https://vk.com/team?z=photo6492_456240778
  $.attach('photo', 6492, 456240778)
}, 'shows the help message')

var Keyboard = vk.kbd.Keyboard
var Button = vk.kbd.Button
var colors = vk.kbd.colors

core.cmd('keyboard', $ => {
  // Set 'true' instead of 'false' to make it disapper after a button was pressed
  var kbd = new Keyboard([
    // Rows
    [
      new Button('/now'),
      new Button('/info', colors.primary),
      new Button('/rmkbd', colors.negative),
      new Button('/help', colors.positive)
    ],
    [
      new Button('Maximum rows is 10, columns - 4.')
    ],
  ], false)

  $.text('Here is your keyboard, as promised.')
  $.keyboard(kbd)
}, 'demo keyboard')

core.cmd('rmkbd', $ => {
  $.text('Ok, ok, no keyboard for you.')
  $.removeKeyboard()
}, 'removes keyboard')

core.cmd('now', $ => {
  // Format time using 'moment' library
  var now = moment().utc().format('MMMM Do YYYY [(]dddd[)] hh:mm:ss A')

  $.text('It is ' + now + ' UTC now.')
}, 'reports the current date and time in UTC')

core.cmd('info', async $ => {
  var uid = $.obj.from_id

  // Call VK API to get information about the user
  var response = await $.api.scheduleCall('users.get', { user_ids: uid })
  var userInfo = response[0]

  var name = userInfo.first_name
  var surname = userInfo.last_name

  $.text(`User ID: ${uid}\nName: ${name} ${surname}`)
}, 'uses VK API to get some information about you')

// When the message contains a word "hi", "hello" or "hey"
// Ignoring case with /i
core.regex(/h(i|ello|ey)/i, $ => {
  $.text('Hello, I am a test bot. You said: ' + $.msg)
})

core.regex(/sup/i, $ => {
  $.text('Hello brother: ' + $.msg)
})

core.regex(/menu/i, $ =>{
  var kbd = new Keyboard([
    // Rows
    [
      new Button('Subscription'),
      new Button('Settings', colors.primary),
      new Button('Help', colors.negative),
      new Button('Feedback', colors.positive),

    ],
    [
      new Button('Remove')
    ],
  ], false)

  $.text('Here is your keyboard, as promised.')
  $.keyboard(kbd)
},
)
//end of menu

//handling the buttons in the menu (remove button)
core.regex(/Remove/, $ =>{
  $.text('Ok, ok, no keyboard for you.')
  $.removeKeyboard()
})

//handling manage Subscription button
core.regex(/Subscription/, $ =>{
  $.text(" Here's your subscription menu")
  var kbd = new Keyboard([
    // Rows
    [
      new Button('Subscribe coin'),
      new Button('Unsubscribe coin', colors.primary),
    ],
    [
      new Button('View All', colors.negative),
      new Button('Menu', colors.positive)
    ]
  ], false)
  $.keyboard(kbd)
})

//handling settings menu
core.regex(/Settings/, $ =>{
  $.text("Please choose your preffered language")
  var kbd = new Keyboard([
    [
    new Button('English',colors.primary),
    new Button('Russian',colors.positive),
    new Button('Remove',colors.negative),
    new Button('Menu')
    ]
  ], false)
  $.keyboard(kbd)
})

//handling Feedback button
core.regex(/Feedback/, $ =>{
  state.processState('Feedback', $)
})

//handling Subscribe button
core.regex(/Subscribe coin/, $ =>{
  state.processState('Subscribe coin', $)
})

//handling Unsubscribe button
core.regex(/Unsubscribe coin/,$ =>{
  state.processState('Unsubscribe coin', $)
  var kbd = new Keyboard([
    // Rows
    [
      new Button('coin1'),
      new Button('coin2', colors.primary),
    ],
    [
      new Button('coin3', colors.negative),
      new Button('coin4', colors.positive)
    ],
    [
      new Button('coin5'),
      new Button('coin6', colors.primary),
    ],
    [
      new Button('coin7', colors.negative),
      new Button('Back', colors.positive)
    ],
  ], false)
  $.keyboard(kbd)
})

//handling View All button
core.regex(/View All/, $ =>{
  $.text("Here is the list of all coins")
  var kbd = new Keyboard([
    // Rows
    [
      new Button('coin1'),
      new Button('coin2', colors.primary),
    ],
    [
      new Button('coin3', colors.negative),
      new Button('coin4', colors.positive)
    ],
    [
      new Button('coin5'),
      new Button('coin6', colors.primary),
    ],
    [
      new Button('coin7', colors.negative),
      new Button('Back', colors.positive)
    ],
  ], false)
  $.keyboard(kbd)
})

//handling back button
core.regex(/Back/, $ =>{
  $.text(" Here's your subscription menu")
  var kbd = new Keyboard([
    // Rows
    [
      new Button('Subscribe coin'),
      new Button('Unsubscribe coin', colors.primary),
    ],
    [
      new Button('View All', colors.negative),
      new Button('Menu', colors.positive)
    ]
  ], false)
  $.keyboard(kbd)
})

core.on('no_match', $ => {
  $.text("I don't know how to respond.")
})

core.on('message_allow', $ => {
  $.text('Hello, thanks for allowing us to send you messages.')
  // $.send() is called automatically after the handler
})

core.on('message_typing_state', $ => {
  $.text('Type faster please, I can\'t wait to see your message!')
})

core.on('handler_error', $ => {
  $.text("Oops, looks like something went wrong.")
})
//
// function Feedback($){
//   $.text("We are eagerly waiting for your feedback")
// }
//
// var state;
// function processState(state, $){
//   switch(state){
//     case 'Feedback': return Feedback($)
//   }
// }
core.noEventWarnings() // Prevent warnings about missing event handlers

bot.start() // Start the bot
