require('dotenv').config()
// import 'dotenv/config'
const TelegramBot = require('node-telegram-bot-api');
// const fetch = require('node-fetch');
const axios = require('axios');
// replace the value below with the Telegram token you receive from @BotFather
// const token = process.env.TYNI_TG_BOT_API;
const token = process.env.TYNI_TG_BOT_API;
const clonedVoiceApiKey= process.env.ALIKA_CLONED_VOICE_API;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

async function fetchTextToSpeech(msgg) {
    const voiceId = process.env.ALIKA_CLONED_VOICE_ID;
    const xiApiKey = process.env.ALIKA_CLONED_VOICE_API;
  
    try {


    const options = {
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        headers: {
          accept: 'audio/mpeg', // Set the expected response type to audio/mpeg.
          'content-type': 'application/json', // Set the content type to application/json.
          'xi-api-key': `${xiApiKey}`, // Set the API key in the headers.
        },
        data: {
          text: msgg, // Pass in the inputText as the text to be converted to speech.
        },
        responseType: 'arraybuffer', // Set the responseType to arraybuffer to receive binary data as response.
      };
    
      // Send the API request using Axios and wait for the response.
      const speechDetails = await axios.request(options);
    
      // Return the binary audio data received from the API response.
      console.log('done..1')
      // console.log(speechDetails.data)
      
      return speechDetails.data;

    } catch (error) {
      console.error(error);
    }
}
// // Example usage:
// async function main() {
//   const audioFile = await fetchTextToSpeech("Hello world!");
//   // Do something with the audio file here
// }


// Matches "/echo [whatever]"
// bot.onText(/\/love/, (msg, match)   => {
  bot.onText(/\/echo (.+)/, (msg, match)   => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  console.log('new /\/love/ message received!!')
  console.log(msg.text)
  // 
  const resp = match[0]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    console.log('new message received!!')
    console.log(msg.text)
    // await fetchTextToSpeech(msg.text);
    const audioFile = await fetchTextToSpeech(msg.text);

    console.log('done..2')
    console.log('audioFile',audioFile)
   
    console.log(msg.from.id)

    // send a message to the chat acknowledging receipt of their message
    bot.sendAudio(chatId, audioFile);
    bot.sendMessage(chatId, "-tynibot");
    
  });
  