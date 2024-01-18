const ElevenLabs = require('elevenlabs-node');
const createPronunciationFunc = async (word, pronunciationFilePath) => {
    
    // Prepare options for fetch request
    const voice = new ElevenLabs({
       apiKey: process.env.ELEVEN_VOICE_KEY, // Your API key
       voiceId: "pNInz6obpgDQGcFmaJgB",             // Default Voice ID
   });

   let resource = await voice.textToSpeech({
       // Required Parameters
       fileName:        pronunciationFilePath,                    // The name of your audio file
       textInput:       word,                // The text you wish to convert to speech
   
       // Optional Parameters
       stability:       0.5,                            // The stability for the converted speech
       similarityBoost: 0.5,                            // The similarity boost for the converted speech
       modelId:         "eleven_multilingual_v2",   // The ElevenLabs Model ID
       style:           1,                              // The style exaggeration for the converted speech
       speakerBoost:    true                            // The speaker boost for the converted speech
   }).then((res) => {
       //console.log(res);
   });
}

module.exports = createPronunciationFunc;