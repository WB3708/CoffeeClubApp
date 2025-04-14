 const now = new Date();
  console.log(now); // Full date and time

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  var tutorialStep = 0;

const currentOrder = [];

const todaysOrders = [];

const itemTemplate = document.getElementById("RecieptItemSample");
const container = document.getElementById("RecieptList");

const total = document.getElementById("RecieptTotal");
var totalCost = 0.00;
var ticketDrink = false;
var ticketSnack = false;

function addOrder(item, price) {
  console.log("addOrderStarted");
  const ticket = document.getElementById("ticket").checked;
  let isFreeItem = false;

  if (ticket === true) {
    if (ticketDrink === false && (item === "Coffee" || item === "Mocha" || item === "Iced Coffee" || item === "Hot Cocoa" || item === "Iced Mocha")) {
      ticketDrink = true;
      isFreeItem = true;
      price = 0.00;
    }
    if (ticketSnack === false && item === "Snack") {
      ticketSnack = true;
      isFreeItem = true;
      price = 0.00;
    }
  }

  currentOrder.push({ name: item, cost: price, isTicketItem: isFreeItem });
  
  const clone = itemTemplate.cloneNode(true);
  clone.querySelector("#RecieptItemName").textContent = item;
  clone.querySelector("#RecieptItemCost").textContent = "$" + price.toFixed(2);
  clone.style.display = "flex";
  clone.querySelector("#removeItem").style.display = "inline-block";
  clone.querySelector("#RecieptItemName").style.display = "inline-block";
  clone.querySelector("#RecieptItemCost").style.display = "inline-block";
  container.appendChild(clone);
  totalCost += price;
  total.textContent = "$" + totalCost.toFixed(2);
  console.log("addOrderComplete");
}

function finishOrder() {
  console.log("finishOrderStarted");
  if (currentOrder.length === 0) {
    alert("No items in order");
    return;
  }
  const order = {
    time: now,
    items: [...currentOrder],
    total: totalCost,
    ticket: document.getElementById("ticket").checked
  };
  todaysOrders.push(order);
  console.log(todaysOrders);
  currentOrder.length = 0;
  totalCost = 0.00;
  ticketDrink = false;
  ticketSnack = false;
  total.textContent = "$" + totalCost.toFixed(2);
  container.innerHTML = "";
  document.getElementById("Confirmation").style.display = "block";
  setTimeout(function() {
    document.getElementById("Confirmation").style.display = "none";
  }, 2000);
}
function removeItem(element) {
  const itemDiv = element.parentElement;
  const cost = parseFloat(itemDiv.querySelector("#RecieptItemCost").textContent.replace('$', ''));
  totalCost -= cost;
  total.textContent = "$" + totalCost.toFixed(2);
  itemDiv.remove();
  
  const itemName = itemDiv.querySelector("#RecieptItemName").textContent;
  const index = currentOrder.findIndex(item => item.name === itemName);
  
  if (index !== -1) {
    const removedItem = currentOrder[index];
    if (removedItem.isTicketItem) {
      if ((itemName === "Coffee" || itemName === "Mocha" || itemName === "Iced Coffee" || itemName === "Hot Cocoa" || itemName === "Iced Mocha")) {
        ticketDrink = false;
      } else if (itemName === "Snack") {
        ticketSnack = false;
      }
    }
    currentOrder.splice(index, 1);
  }
}

function compileDay() {
  console.log("compileDayStarted");
  let summary = "Daily Orders Summary:\n\n";
  let totalRevenue = 0;
  let ticketCount = 0;

  todaysOrders.forEach((order, index) => {
    summary += `Order ${index + 1} - ${order.time.toLocaleTimeString()}\n`;
    
    // Count items in the order
    const itemCounts = order.items.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});

    // Display items with their counts and total cost per item
    Object.entries(itemCounts).forEach(([itemName, count]) => {
      const itemCost = order.items.find(item => item.name === itemName).cost;
      summary += `${count}x ${itemName} @ $${itemCost.toFixed(2)} = $${(count * itemCost).toFixed(2)}\n`;
    });
    
    summary += `Total: $${order.total.toFixed(2)}\n`;
    //summary += `Ticket: ${order.ticket ? "Yes" : "No"}\n\n`;
    
    if (order.ticket) {
      ticketCount++;
    } 
    totalRevenue += order.total;
  });

  summary += `Total Revenue: $${totalRevenue.toFixed(2)}\n`;
  summary += `Number of Tickets: ${ticketCount}`;

  document.getElementById("summaryText").value = summary;
  document.getElementById("DailySummary").style.display = "block";
}

function copyToClipboard() {
  const summaryText = document.getElementById("summaryText");
  summaryText.select();
  document.execCommand("copy");
}

function closeSummary() {
  document.getElementById("DailySummary").style.display = "none";
}

function reset() {
  const result = confirm("Are you sure you want to reset? This will clear all orders for the day.");
  if (!result) {
    return;
  }
  else {
  console.log("resetStarted");
  currentOrder.length = 0;
    todaysOrders.length = 0;
  totalCost = 0.00;
    tutorialStep = 0;
  ticketDrink = false;
  ticketSnack = false;
  total.textContent = "$" + totalCost.toFixed(2);
  container.innerHTML = "";
  document.getElementById("ticket").checked = false;
}
}

function nextTutorial() {
  console.log("nextTutorialStarted");
  tutorialStep++;
  if (tutorialStep === 1) {
    document.getElementById("tutorialContent").textContent = "Click on the items you want to add to the order.";
    document.getElementById("Mocha").style.borderColor = "#FFFF00";
  } else if (tutorialStep === 2) {
    document.getElementById("tutorialContent").textContent = "Once the customer is done ordering, click on the 'Finish Order' button.";
    document.getElementById("RecieptButton").style.borderColor = "#FFFF00";
    document.getElementById("Mocha").style.borderColor = "#FFFFFF";
  } else if (tutorialStep === 3) {
    document.getElementById("tutorialContent").textContent = "Click on the 'Daily Summary' button to see the summary of the day.";
    document.getElementById("DayDone").style.borderColor = "#FFFF00";
    document.getElementById("RecieptButton").style.borderColor = "#FFFFFF";
  } else if (tutorialStep === 4) {
    document.getElementById("tutorialContent").textContent = "Click on the 'Reset' button to reset the app.";
    document.getElementById("Reset").style.borderColor = "#FFFF00";
    document.getElementById("DayDone").style.borderColor = "#FFFFFF";
  } else if (tutorialStep === 5) {
    document.getElementById("tutorialContent").textContent = "Click on the 'Tutorial' button to see the tutorial again.";
    document.getElementById("Reset").style.borderColor = "#FFFFFF";
    document.getElementById("tutorialBtn").style.borderColor = "#FFFF00";
  } else if (tutorialStep === 6) {
    document.getElementById("tutorialContent").textContent = "Click on the 'Close' button to close the tutorial.";
    document.getElementById("tutorialCloseBtn").style.borderColor = "#FFFF00";
    document.getElementById("tutorialBtn").style.borderColor = "#FFFFFF";
  } else if (tutorialStep === 7) {
    document.getElementById("tutorialContent").textContent = "That's it! You're ready to go!";
    document.getElementById("tutorialCloseBtn").style.borderColor = "#000000";
    document.getElementById("tutorialNextBtn").style.display = "none";
  } else if (tutorialStep === 8) {
    document.getElementById("tutorialText").style.display = "none";
  }
}

function closeTutorial() {
  console.log("closeTutorialStarted");
  document.getElementById("tutorialText").style.display = "none";
}

function tutorial() {
  console.log("tutorialStarted");
  document.getElementById("tutorialText").style.display = "block";
  document.getElementById("tutorialContent").textContent = "Welcome to the Mane Bean app! Here's a quick tutorial to get you started!";
  document.getElementById("tutorialNextBtn").style.display = "inline-block";
  tutorialStep = 0;
}
