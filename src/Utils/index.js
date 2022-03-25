export function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

export function generateResults(url, medium, bizUnit, term, content, id, name) {
  if (!url) {
    return alert("Please provide a website URL.");
  }

  let finalResults = [];

  const social = ["linkedin", "twitter", "facebook", "instagram"];

  social.forEach((s) => {
    finalResults.push(
      encodeURI(
        `${url}?utm_source=${bizUnit}&utm_medium=${medium}&utm_social=${s}&utm_term=${term}&utm_campaign=${name}&utm_id=${id}&utm_content=${content}`
      )
    );
  });
  return finalResults
}