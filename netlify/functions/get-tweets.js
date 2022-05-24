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
  
  const apiKey = "AAAAAAAAAAAAAAAAAAAAAFLycgEAAAAAmkWteNs0IURxKkr7%2FWhOIk6Lslc%3DMy7TfunNzuCWplL3z0NK8eC57ooHQRVFN5r22YBETqe04BiMF9"
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`
  }

    let response = await fetch(`https://api.twitter.com/2/users/16892009/tweets?tweet.fields=text&user.fields=username,profile_image_url&media.fields=preview_image_url,url`, { headers })

    let res = await response.json()
    
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(res)
  }
}

module.exports = { handler }
