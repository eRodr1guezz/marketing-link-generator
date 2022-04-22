import {
  Facebook,
  Instagram,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import { InstanceUrl } from "../Reducers/urlBuildReducer";

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

  const fetchBody = {
    method: "POST",
    body: JSON.stringify({
      // group_guid: "o_5kc1f828jm",
      long_url: url,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  }

  if (typeof url === 'string') {
    await fetch(bitlyURL, fetchBody)
      .then((resp) => resp.json())
      .then((data) => data.message === 'FORBIDDEN' ?
        { type: 'error', value: 'Invalid access token. Please check and try again.' } :
        data.link
      )
  } else if (Array.isArray(url)) {
    let urlList = url.map(async u => {
      return await fetch(bitlyURL, {
        method: "POST",
        body: JSON.stringify({
          // group_guid: "o_5kc1f828jm",
          long_url: u,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }).then(resp => resp.json()).then((data) => data.link)
    }
    )
    return urlList.map(u => new InstanceUrl(u, uuidv4()))
  }
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
