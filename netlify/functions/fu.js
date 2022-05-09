const handler = async function (event, context) {
  console.log('hheheeh')
  return {
    statusCode: 200,
    body: 'derp!'
  }
}

module.exports = { handler }
