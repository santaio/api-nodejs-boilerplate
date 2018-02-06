module.exports = () => {

  const underline = () => {
    let line = ''
    for (let i = 0; i < process.stdout.columns - 2; i++) { line = `${line}-` }
    return line
  }

  return {
    underline
  }

}
