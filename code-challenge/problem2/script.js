const url = "https://interview.switcheo.com/prices.json";
let prices = {}; 

async function loadPrices() {
    try {
        let res = await fetch(url);
        const priceData = await res.json();

        priceData.forEach(item => { 
            prices[item.currency] = item.price;
        });

        console.log("Loaded prices:", prices);
        populateTokenOptions();
    } catch (err) {
        console.log("Error:", err);
    }
}
loadPrices();

function populateTokenOptions() {
    const tokens = Object.keys(prices); 
    const fromSelect = document.getElementById('fromSelect');
    const toSelect = document.getElementById('toSelect');

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    tokens.forEach(token => {
        const fromOption = document.createElement('option');
        fromOption.value = token;
        fromOption.textContent = token;
        fromSelect.appendChild(fromOption);

        const toOption = document.createElement('option');
        toOption.value = token;
        toOption.textContent = token;
        toSelect.appendChild(toOption);
    });
}

const fromSelect = document.getElementById("fromSelect");
const toSelect = document.getElementById("toSelect");
const fromImg = document.getElementById("fromImg");
const toImg = document.getElementById("toImg");
const inputAmount = document.getElementById("input-amount");
const outputAmount = document.getElementById("output-amount");
const btn = document.getElementById("swapBtn");


function updateFromImage() {
    const token = fromSelect.value;
    fromImg.src = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;
}

function updateToImage() {
    const token = toSelect.value;
    toImg.src = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;
}

let gasFee = 0; //ready for future calculation
let swapFee = 0;//ready for future calculation

function convertAmount() {
    const inputValue = parseFloat(inputAmount.value);
    if (isNaN(inputValue) || inputValue <= 0) {
        outputAmount.value = ""; // Clear output if input is invalid
        totalReceive.textContent = "";
        return;
    }

    const fromToken = fromSelect.value;
    const toToken = toSelect.value;

    if (fromToken === toToken) {
        outputAmount.value = inputValue.toString(); 
        updateTotalReceived();
        return; 
    }

    // Get the prices for conversion
    const fromPrice = prices[fromToken];
    const toPrice = prices[toToken];

    if (fromPrice && toPrice) {
        const convertedValue = (inputValue * fromPrice) / toPrice; // Conversion logic
        outputAmount.value = convertedValue.toString(); 
        updateTotalReceived();
    } else {
        outputAmount.value = ""; 
        totalReceive.textContent = "";
    }
}
function showAlert(message) {
    alert(message); 
}

function submitBtn(){
    const inputValue = parseFloat(inputAmount.value);
    if(isNaN(inputValue)){
        showAlert("Invalid input! Please enter again");
        inputAmount.value = "";
        outputAmount.value = ""; 
        totalReceive.textContent = "";
        return;
    }else if( inputValue <= 0){
        showAlert("No 0 or negative value is allowed! Please enter again");
        inputAmount.value = "";
        outputAmount.value = ""; 
        totalReceive.textContent = "";
        return;
    }

    //Loading
    startLoading();
    fakeSwapProcess()
    .then(()=>{
        //Success
        stopLoading("Successful Swap");
        resetInput();
    })
    .catch(()=>{
        //Fail
        stopLoading("Swap Failed");
        showAlert("Transaction Failed, try again please")
    })
}

function startLoading() {
    btn.disabled = true;
    btn.classList.add("loading");
  
    btn.innerHTML = `<span class="spinner"></span> Processing...`;
  }
  
  function stopLoading(msg) {
    showAlert("Successful Swap!!");
    btn.disabled = false;
    btn.classList.remove("loading");
    btn.innerText = "Confirm Swap";  
  }
  
  function resetInput() {
    inputAmount.value = "";
    outputAmount.value = "";
    totalReceive.textContent = "";
  }

  function fakeSwapProcess() {
    return new Promise((resolve, reject) => {
  
      setTimeout(() => {
        const successRate = 0.99;
  
        if (Math.random() < successRate) {
          resolve("Swap successful");
        } else {
          reject("Network error. Please try again.");
        }
      }, 1800); 
    });
  }

  const gasFeeElement = document.getElementById('gas-fee'); 
  const swapFeeElement = document.getElementById('swap-fee'); 
  const totalReceive = document.getElementById('total-receive');

//total received amount
function updateTotalReceived() {
    const receivedAmount = parseFloat(outputAmount.value);

    const totalReceived = receivedAmount - (gasFee + swapFee); 
    totalReceive.textContent = totalReceived.toString(); 
    gasFeeElement.textContent = gasFee.toString();
    swapFeeElement.textContent = swapFee.toString();
}

let currentSlide = 0; 
const slides = document.querySelectorAll('.slide'); 

function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length; // Loop back to the first slide
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length; // Loop back to the last slide
    showSlide(currentSlide);
}

setInterval(nextSlide, 5000);

// Event Listeners
fromSelect.addEventListener("change", () => {
    updateFromImage();
    convertAmount(); // Convert on changing from select
});

toSelect.addEventListener("change", () => {
    updateToImage();
    convertAmount(); // Convert on changing to select
});

// Listen for input amount changes for auto conversion
inputAmount.addEventListener("input", convertAmount);