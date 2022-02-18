const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000

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

app.listen(port, () => console.log('listening on port ' + port))
