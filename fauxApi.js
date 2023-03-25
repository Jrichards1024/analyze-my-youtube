var webdriver = require ('selenium-webdriver');
By = webdriver.By;
var driver = new webdriver.Builder()
  .forBrowser('chrome')
//   .setChromeOptions(
    // .addArguments("user-data-dir=/Users/jorichards/Library/Application Support/Google/Chrome/Profile 1"))
  .build();



driver.get("https://www.youtube.com/").then(async()=>{
    signinButton = await driver.findElement(By.xpath("//a[@class = 'yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--call-to-action yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading ']"));
    await signinButton.click();
    await driver.findElement(By.xpath("//input[@class='whsOnd zHQkBf']")).sendKeys('josephrichards1024@gmail.com');
    userName = await driver.findElement(By.xpath("//button[@class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b']"));
    userName.click();
    // userNameGsuite = await driver.findElement(By.xpath("//input[@name = 'loginfmt']")).sendKeys('jorichards@davidson.edu');
});
