const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");
const schools = require("./Schools");
async function getAllLogos() {
  let driver = await new Builder().forBrowser("safari").build();
  try {
    let logoList = [];
    await driver.get("https://www.nfhsnetwork.com/find-school/illinois");
    for (let i = 0; i < 54; i++) {
      let logos = await driver.findElements(By.css("img.profile-logo"));
      let schoolNames = await driver.findElements(By.css("p.profile-name"));
      for (let i = 0; i < logos.length; i++) {
        logoList.push({
          src: await logos[i].getAttribute("src"),
          school: await schoolNames[i].getText(),
        });
      }
      await driver.findElement(By.css("p.label[data-v-3e3853ae]")).click();
      await driver.sleep(100);
    }

    //console.log(logoList);
    logoList = logoList.filter((value, index, self) => index === self.findIndex((t) => t.school === value.school));
    fs.writeFileSync("Logos.js", JSON.stringify(logoList));
  } finally {
    await driver.quit();
  }
}

async function getSchoolLogos() {
  //https://www.nfhsnetwork.com/search/?query=wheeling
  let driver = await new Builder().forBrowser("safari").build();
  try {
    let logoList = [];
    for (let i = 0; i < schools.schools.length; i++) {
      await driver.get(
        "https://www.nfhsnetwork.com/search/?query=" + schools.schools[i].replace("High School", "").replace("HS", "")
      );
      try {
        let logo = await driver.findElement(By.css("a.event-card > div > div.card-main > img.profile-logo"));
        console.log(" work", schools.schools[i].replace("High School", ""), await logo.getAttribute("src"));
        logoList.push({ school: schools.schools[i], url: await logo.getAttribute("src") });
      } catch {
        console.log("didnt work", schools.schools[i].replace("High School", ""));
      }
      await driver.sleep(1000);
    }
    fs.writeFileSync("SchoolLogos.js", JSON.stringify(logoList));
  } finally {
    await driver.quit();
  }
}

async function getSchools() {
  let driver = await new Builder().forBrowser("safari").build();
  try {
    await driver.get("https://www.lfacaxys.org/schedule-results");
    let schoolList = [];
    for (let i = 0; i < 8; i++) {
      let month = await driver.findElements(By.css("a.fsCalendarEventTitle.fsCalendarEventLink"));
      for (let i = 0; i < month.length; i++) {
        let school = await month[i].getText();
        schoolList.push(school.substring(school.indexOf("vs.") + 3, school.lastIndexOf("(")).trim());
      }
      await driver.findElement(By.css("button.fsCalendarNextMonth.fsRightArrow")).click();
      await driver.sleep(1500);
    }
    fs.writeFileSync("Schools.js", JSON.stringify([...new Set(schoolList)]));
  } finally {
    await driver.quit();
  }
}

getSchoolLogos();
