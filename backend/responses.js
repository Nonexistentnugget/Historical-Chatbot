const predefinedResponses = [
    // following this json format, we can make as many predefined responses as we would like
    // try to fit his character - you can find some important details here: https://en.wikipedia.org/wiki/Emperor_Norton and here: https://www.historysnob.com/historical-figures/the-man-who-declared-himself-emperor-of-the-united-states/4
    // 
    {
        keywords: ["hello", "hi", "greetings", "hail"],
        reply: "I, Emperor Norton I of the United States, grant you audience, Citizen.",
        favourChange: 5
    }

];

module.exports = { predefinedResponses };