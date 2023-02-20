module.exports = {
  generateYears: () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= 1950; i--) {
      years.push(i);
    }
    return years;
  },
  generateDistricts: () => {
    const districts = [
      "Kasaragod",
      "Kannur",
      "Wayanad",
      "Kozhikkode",
      "Malappuram",
      "Palakkad",
      "Thrissur",
      "Eranakulam",
      "Thiruvananthapuram",
      "Kollam",
      "Alappuzha",
      "Pathanamthitta",
      "Kottayam",
      "Idukki",
    ];
    return districts;
  },
  generateBloodGroups: () => {
    const bloodgroups = ["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"];
    return bloodgroups;
  },
};
