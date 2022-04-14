const colors = require("colors");

const chosenColor = colors.getRandomColor();
console.log(
  `You should use ${chosenColor.name} on your website. It's HTML code is ${chosenColor.code}`
);

const favoriteColor = colors.getBlue();
console.log(
  `My favorite color is ${favoriteColor.name}/${favoriteColor.code}, btw`
);
