// Random Quotes Api URL
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=140";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display random quote
const renderNewQuote = async () => {
  // Fetch contents from url
  const response = await fetch(quoteApiUrl);

  // Store response
  let data = await response.json();

  // Access quote
  quote = data.content;

  console.log(data.content);

  // Array of characters in the quote
  let arr = quote.split("").map((value) => {
    // wrap the characters in a span tag
    return "<span class='quote-chars'>" + value + "</span>";
  });
  // Join array for displaying
  quoteSection.innerHTML += arr.join("");
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};

// Logic for comparing input words with quote
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  // Creae an array from received span tags
  quoteChars = Array.from(quoteChars);

  // Array of user input characters
  let userInputChars = userInput.value.split("");

  // Loop through each character in quote
  quoteChars.forEach((char, index) => {
    // Check if char(quote character) = userInputChars[index](input character)
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    }
    // If user hasn't entered anything or backspaced
    else if (userInputChars[index] == null) {
      // Remove class if any
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    }
    // If user enter wrong character
    else {
      // Checks if we already have added fail class
      if (!char.classList.contains("fail")) {
        // Increment and display mistakes
        mistakes += 1;
        char.classList.add("fail");
      }
      document.getElementById("mistakes").innerText = mistakes;
    }
    // Returns true if all the characters are entere correctly
    let check = quoteChars.every((element) => {
      return element.classList.contains("success");
    });
    // End test if all characters are correct
    if (check) {
      displayResult();
    }
  });
});

// Update Timer on screen
function updateTimer() {
  if (time == 0) {
    // End test if timer reaches 0
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

// Sets timer
const timerReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

// End Test
const displayResult = () => {
  // Display result div
  document.getElementById("result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  let timeTaken = 1;
  if (timer != 0) {
    timeTaken = (60 - time) / 100;
  }
  document.getElementById("wpm").innerText =
    (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
  document.getElementById("accuracy").innerText =
    Math.round(
      ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + "%";
};
// Start test
const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timerReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};
