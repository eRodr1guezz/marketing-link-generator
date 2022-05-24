const fetch = require('node-fetch')

const handler = async function (event, context) {

  if (!context.clientContext && !context.clientContext.identity) {
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({
        msg: 'No identity instance detected. Did you enable it?',
      }),
    }
  }

  async function getTwitterData() {
    let response = await fetch(`https://api.twitter.com/2/tweets/search/recent?query=from:twitterdev`, { headers })

    let res = response.json()
    
    return res
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(getTwitterData())
  }
}

module.exports = { handler }
