import { Facebook, Instagram, LinkedIn, Twitter } from "@mui/icons-material";
import axios from "axios";

export function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

export function socialIconHandler(param) {
  switch (param) {
    case "twi":
      return <Twitter />;
    case "li":
      return <LinkedIn />;
    case "fb":
      return <Facebook />;
    case "in":
      return <Instagram />;
    default:
      return null;
  }
}

export async function shortenURL(url, access_token) {
  //should accept a single (or list) of urls to shorten and return a single (or list of) URL instance(s).
  const bitlyURL = `https://api-ssl.bitly.com/v4/shorten`;
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`,
  }

  let innerResponse = url.map(async (u) => {
    let response = await axios.post(bitlyURL, { 
        data: JSON.stringify({ long_url: u }),
        headers: headers
      })

    return response.data
  })

  return innerResponse
  //   return axios.get(bitlyURL, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       // group_guid: "o_5kc1f828jm",
  //       long_url: u,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${access_token}`,
  //     },
  //   }).then(response => response.json())
  //   .then(data => data)
  // })
}

export function getStyles(name, driverName, theme) {
  return {
    fontWeight:
      driverName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const ITEM_HEIGHT = 48;
export const ITEM_PADDING_TOP = 8;
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
