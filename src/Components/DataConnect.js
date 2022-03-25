import { useState, useEffect } from 'react'
import { parse } from 'papaparse'
import Form from './Form'
import { Icon } from '@mui/material';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Input = styled('input')({
  display: 'none',
});

export default function DataConnect() {
  const [fileData, setFileData] = useState()
  const [isVisible, setIsVisible] = useState(false)

  let stateTracker = []

  function handleCsvUpload(id) {
    const fileInput = document.getElementById(id)
    const [file] = fileInput.files

    parse(file, {
      header: true,
      complete: (result) => {
        stateTracker.push(result.data)

        if (stateTracker.length === 3) {
          setFileData(stateTracker)
          setIsVisible(true)
        }
      }
    })
  }

  return (
    <>{
      !isVisible ?
        <div
          className="form-wrapper"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '200px',
            minWidth: '275px'
          }}>
          <label htmlFor="businessUnit">
            Select Business Unit CSV
            <Input accept="csv/*" id="businessUnit" type="file" onChange={e => handleCsvUpload(e.currentTarget.id)} />
            <Button color="secondary" variant="contained" component="span">
              Upload
            </Button>

          </label>
          <label htmlFor="vehicleClass">
            <Input accept="csv/*" id="vehicleClass" type="file" onChange={e => handleCsvUpload(e.currentTarget.id)} />
            <Button color="secondary" variant="contained" component="span">
              Select Vehicle Class CSV
            </Button>

          </label>
          <label htmlFor="vehicleType">
            <Input accept="csv/*" id="vehicleType" type="file" onChange={e => handleCsvUpload(e.currentTarget.id)} />
            <Button color="secondary" variant="contained" component="span">
              Select Vehicle Type CSV
            </Button>

          </label>
        </div> : <Form value={fileData.flat()} />
    }
    </>
  )
}