import React, { useState } from 'react'
import ResultRow from './ResultLine';


export default function Form({ values }) {
  const [source, setSource] = useState('')
  const [website, setWebsite] = useState('')
  const [medium, setMedium] = useState('')
  const [results, setResults] = useState()

  function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  }

  function generateResults(website, medium, source) {
    if (!website) {
      return alert('Please provide a website.')
    }

    let finalResults = []

    const social = ['linkedin', 'twitter', 'facebook', 'instagram']

    social.forEach(s => {
      finalResults.push(encodeURI(website + '?' + 'utm_source=' + source + '&utm_medium=' + medium + '&utm_social=' + s))
    })

    // let med = ['web', 'email', 'newsletter']

    // med.forEach(m => {
    //   finalResults.push(encodeURI(website + '?' + 'utm_source=' + source + '&utm_medium=' + m))
    // })

    setResults(finalResults)
  }

  return (
    <>
      <div className='form-wrapper'>
        <h1 style={{ fontWeight: 800 }}>Campaign URL Builder</h1>
        <div className="form">
          <div className="form-control">
            <label><strong>Website URL</strong>
              <input
                type="url"
                className="text-input"
                onChange={e => setWebsite(e.currentTarget.value)}
              />
              {website ? <small style={{ color: 'red', position: 'absolute' }}>{validateUrl(website) ? '' : 'Please enter a valid URL.'}</small> : null}
            </label>
          </div>
          <div className='form-control'>
            <label><strong>Source</strong>
              <input
                className="text-input"
                onChange={e => setSource(e.currentTarget.value)}
              />
            </label>
          </div>
          <div className='form-control'>
            <label><strong>Medium</strong>
              <input
                className="text-input"
                onChange={e => setMedium(e.currentTarget.value)}
              />
            </label>
          </div>

          <button className="button" onClick={() => generateResults(website, medium, source)}>Generate URLs</button>

        </div>
        {results && results}
        {results &&
          <div className="results-wrapper">
            {results && results.map((r, i) => {
              const parseableUrl = new URLSearchParams(r)
              const type = parseableUrl.get('utm_social')

              return (
                <ResultRow url={r} key={i} type={type} />
              )
            })}
          </div>
        }
      </div>
    </>
  )
}