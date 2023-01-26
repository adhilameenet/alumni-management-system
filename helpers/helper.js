module.exports = {
  generateYears: () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = currentYear; i >= 1950; i--) {
      years.push(i)
    }
    return years
  }
}
