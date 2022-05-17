import download from 'downloadjs'
import { unparse } from 'papaparse'
import { Facebook, Flag, Instagram, LinkedIn, Twitter } from "@mui/icons-material";

export function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    value
  );
}

export function socialIconHandler(param) {
  switch (param) {
    case "twi":
      return <Twitter htmlColor="#1DA1F2" />;
    case "li":
      return <LinkedIn htmlColor="#0072B1" />;
    case "fb":
      return <Facebook htmlColor="#4267B2" />;
    case "in":
      return <Instagram htmlColor="#8a3ab9" />;
    case "ban":
      return <Flag color="success" />;
    default:
      return null;
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


export function convertAndExportToCsv(data, urlPairs) {
  let campaignObject = {}

  let d = data.map(camp => {
    const { name, id, createdAt, urls } = camp
    campaignObject.name = name;
    campaignObject.id = id;
    campaignObject.createdAt = createdAt;

    campaignObject.data = urls.map(u => {
      return {
        campaign_name: name,
        drivers: [u.driver],
        urls: [u.href],
        shortened: urlPairs ? urlPairs.filter(url => url.oldUrl === u.href)[0].shortUrl : '',
        created: createdAt
      }
    })
    return campaignObject
  })

  d.forEach(campaign => {
    let csv = unparse(campaign, { header: true })
    download(csv, `exportedUrls[${campaign.name}].csv`)
  })

}