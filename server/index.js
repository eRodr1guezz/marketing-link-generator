const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000
const fs = require('fs')
const Papa = require('papaparse')
const { default: axios } = require('axios')

const campaignData = [
  {
    campaignID: 1,
    campaignName: 'Some New Pharma Drug',
    vertical: 'P2P'
  },
  {
    campaignID: 2,
    campaignName: '321404.01_Abbvie_HemOnc_P2P_ClinicalConnection(Coventry)_MedAff',
    vertical: this.campaignName
  },
  {
    campaignID: 3,
    campaignName: 'Springtime Hemonc Event',
    vertical: 'Medaffairs'
  },
  {
    campaignID: 4,
    campaignName: 'Email Blast',
    vertical: 'P2P'
  },
]

app.use(express.json())
app.use(cors())

app.get('/api/campaign', (req, res) => {
  res.json(campaignData)
})
//technically speaking p2p - ex. p2p cannot produce a social media post
//therapeutic area ID only
//each id comma would create a new url (checkbox multi select would create multiple urls)
app.get('/parsecsv', async (req, res) => {
  fs.readFile('csvs/data6.csv', 'utf-8', (err, data) => {
    if (err) throw err
    Papa.parse(data,
      {
        header: true,
        complete: parsed => {
          res.send(parsed.data)
        }
      })
  })
})

app.listen(port, () => console.log('listening on port ' + port))
