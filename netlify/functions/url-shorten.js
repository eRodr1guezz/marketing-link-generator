// for a full working demo of Netlify Identity + Functions, see https://netlify-gotrue-in-react.netlify.com/
const fetch = require('node-fetch')

const handler = async function (event, context) {
  const urls = JSON.parse(event.body)

  if (!context.clientContext && !context.clientContext.identity) {
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({
        msg: 'No identity instance detected. Did you enable it?',
      }),
    }
  }

  const bitlyURL = `https://api-ssl.bitly.com/v4/shorten`;
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.BITLY_TOKEN}`,
  };

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(
      await Promise.all(urls.map(async u => {
        const r = await fetch(bitlyURL, {
          method: 'POST',
          headers,
          body: JSON.stringify({ long_url: u }),
        });
        const d = await r.json();
        return d.link
      }))
    )
  }
}

module.exports = { handler }
