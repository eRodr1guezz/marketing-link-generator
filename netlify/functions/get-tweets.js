// const {
//   moderateTweet,
//   badWords,
//   evilTweet,
// } = require("../../medscape_projects/filter");
// const moderateTweet = require('../../medscape_projects/filter').moderateTweet
const { moderateTweet, badWords } = require('../../medscape_projects/filter')
const fetch = require("node-fetch");
const mockTweets = require('../../medscape_projects/mock-tweets/mockTweets.json')

const handler = async function (event, context) {
  const url =
    "https://api.twitter.com/2/tweets/search/recent?query=medscapelive&tweet.fields=attachments,author_id,created_at,entities,id,text&expansions=attachments.media_keys,author_id&media.fields=alt_text,height,media_key,preview_image_url,type,url&user.fields=entities,id,name,profile_image_url,username&max_results=10";

  const testUrl = "https://api.twitter.com/2/tweets/search/recent?query=hawaiiderm2023&tweet.fields=attachments,author_id,created_at,entities,id,text&expansions=attachments.media_keys,author_id&media.fields=alt_text,height,media_key,preview_image_url,type,url&user.fields=entities,id,name,profile_image_url,username"

  const apiKey =
    process.env.TWITTER_TOKEN || process.env.REACT_APP_TWITTER_TOKEN;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  const response = await fetch(url, { headers });

  const res = await response.json();

  const filteredData = mockTweets.data.filter(r => !r.text.includes('RT'))

  // const flattenObject = (obj) => {
  //   const flatObject = {}

  //   Object.keys(obj).forEach(key => {
  //     const value = obj[key]
  //   })
  // }

  function buildTable(data) {
    let finalTweets = []
    let tweetsByAuthorId = {}

    for (let i = 0; i < data.length; i++) {
      let d = data[i]
      if ('attachments' in d && 'media_keys' in d.attachments) {
        d.media_keys = d.attachments.media_keys

        tweetsByAuthorId[data[i].author_id] = d
      }

      tweetsByAuthorId[data[i].author_id] = data[i]

      const mediaKey = tweetsByAuthorId[data[i].author_id]?.media_keys
      console.log(mediaKey)

      if (mediaKey) {
        //if the tweet has a media key we need to get the associated key value with the includes.media object
      }
      // const media = d.includes.media
      // tweetAuthorTable[data[i].author_id]
      // finalTweets.push(tweetAuthorTable)
    }


    // for (let j = 0; j < mockTweets.includes.media.length; j++) {
    //   const mediaKey = mockTweets.includes.media[j].media_key

    // }

    console.log(tweetsByAuthorId)
    return tweetsByAuthorId
  }

  // buildTable(filteredData)

  // for (let i = 0; i < filteredData.length; i++) {
  //   if (mockTweets.includes.media[i].media_key) {
  //     let mediaKey = mockTweets.includes.media[i].media_key
  //     let authorsTable = buildTable(filteredData)

  //     authorsTable[] = ''

  //   }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    body: JSON.stringify(res),
  };
};

module.exports = { handler };
