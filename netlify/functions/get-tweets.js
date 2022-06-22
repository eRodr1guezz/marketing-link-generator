// const {
//   moderateTweet,
//   badWords,
//   evilTweet,
// } = require("../../medscape_projects/filter");
// const moderateTweet = require('../../medscape_projects/filter').moderateTweet
const { moderateTweet, badWords } = require('../../medscape_projects/filter')
// const fetch = require("node-fetch");
const mockTweets = require('../../medscape_projects/mock-tweets/mockTweets.json')

const handler = async function (event, context) {
  let url =
    "https://api.twitter.com/2/users/16892009/tweets?tweet.fields=text&user.fields=username,profile_image_url&media.fields=preview_image_url,url";

  const testUrl =
    "https://api.twitter.com/2/tweets/search/recent?query=medscapelive&tweet.fields=attachments,author_id,created_at,text&expansions=attachments.media_keys,author_id&media.fields=alt_text,media_key,preview_image_url,url&user.fields=entities,name,profile_image_url,url,username";
  const otherUrl =
    "https://api.twitter.com/2/tweets/search/recent?query=medscapelive&expansions=author_id&tweet.fields=attachments,author_id,id,text&media.fields=alt_text,media_key,preview_image_url,url&user.fields=id,name,profile_image_url,username";
  const anotherUrl =
    "https://api.twitter.com/2/tweets/search/recent?query=medscapelive&tweet.fields=attachments,author_id,created_at,entities,id,text&expansions=attachments.media_keys,author_id&media.fields=alt_text,height,media_key,preview_image_url,type,url&user.fields=entities,id,name,profile_image_url,username&max_results=20";

  const apiKey =
    process.env.TWITTER_TOKEN || process.env.REACT_APP_TWITTER_TOKEN;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  // const response = await fetch(anotherUrl, { headers });

  // const res = await response.json();

  const filteredTweets = mockTweets.data.filter(({ text }) => {
    return text.split(" ").filter((w) => w.match(/[^A-Za-z0-9]/g))
  });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
    body: JSON.stringify(filteredTweets),
  };
};

module.exports = { handler };
