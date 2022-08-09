// const {
//   moderateTweet,
//   badWords,
//   evilTweet,
// } = require("../../medscape_projects/filter");
// const moderateTweet = require('../../medscape_projects/filter').moderateTweet
const { moderateTweet, badWords } = require('../../medscape_projects/filter')
const fetch = require("node-fetch");

const mockTweets = require('../../medscape_projects/mock-tweets/mockTweets.json');

const handler = async function (event, context) {
  const id = "103021562"
  const medscapeLiveTweets = `https://api.twitter.com/2/users/${id}/tweets?max_results=10&tweet.fields=attachments,author_id,created_at,id,text&expansions=attachments.media_keys,author_id&media.fields=alt_text,height,media_key,preview_image_url,type,url,variants&user.fields=id,name,profile_image_url,username`
  const url =
    "https://api.twitter.com/2/tweets/search/recent?query=medscapelive&tweet.fields=attachments,author_id,created_at,entities,id,text&expansions=attachments.media_keys,author_id&media.fields=alt_text,height,media_key,preview_image_url,type,url&user.fields=entities,id,name,profile_image_url,username&max_results=15";
  const testUrl = "https://api.twitter.com/2/tweets/search/recent?query=hawaiiderm2023&tweet.fields=attachments,author_id,created_at,entities,id,text&expansions=attachments.media_keys,author_id&media.fields=alt_text,height,media_key,preview_image_url,type,url&user.fields=entities,id,name,profile_image_url,username"

  const apiKey =
    process.env.TWITTER_TOKEN || process.env.REACT_APP_TWITTER_TOKEN;

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  const response = await fetch(url, { headers });
  const res = await response.json();

  const tweetsByAuthorId = getTweetsByAuthorId(res);
  const usersByAuthorId = getUsersByAuthorId(res);
  const mediaKeys = getMediaByMediaKey(res);

  const rawTweetArray = generateTweetArray(tweetsByAuthorId, usersByAuthorId, mediaKeys).filter(t => !t.text.includes('RT'))

  function getTweetsByAuthorId(apiResponse) {
    let tweetByAuthorId = {};

    const { data } = apiResponse;

    for (let i = 0; i < data.length; i++) {
      let tweetData = data[i]
      tweetByAuthorId[tweetData.author_id] = tweetData
    };

    return tweetByAuthorId
  };

  function getUsersByAuthorId(apiResponse) {
    let usersByAuthorId = {}
    const { includes } = apiResponse;

    for (let i = 0; i < includes.users.length; i++) {
      let userData = includes.users[i]
      usersByAuthorId[userData.id] = userData
    };

    return usersByAuthorId
  }

  function getMediaByMediaKey(apiResponse) {
    const { includes } = apiResponse;
    let mediaByMediaKey = {}

    for (let i = 0; i < includes.media.length; i++) {
      let mediaData = includes.media[i]
      mediaByMediaKey[mediaData.media_key] = mediaData
    };

    return mediaByMediaKey
  }

  function generateTweetArray(tweetData, userData, mediaKeys) {
    let tweets = []

    Object.keys(tweetData).forEach(key => {
      let tweetObj = {}
      let media;

      const tweet = tweetData[key]
      const tweetUser = userData[key]

      if ('attachments' in tweet) {
        const tweetMediaKey = tweetData[key].attachments.media_keys[0]
        media = mediaKeys[tweetMediaKey]
      }

      tweetObj = { ...tweet, ...tweetUser, ...media }

      tweets.push(tweetObj)
    })

    return tweets
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },

    body: JSON.stringify(rawTweetArray.slice(0, 7)),
  };
};

module.exports = { handler };
