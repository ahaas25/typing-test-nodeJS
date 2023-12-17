
class vars {
    static backgroundColor = `rgb(48,44,44)`;
    static textColor = 'rgb(120, 236, 220)';
    static testCompleteTexts = ["Test complete!", "Time Taken: ", "WPM: "];
}

function themePage() {
    document.body.style.backgroundColor = vars.backgroundColor;
}

function pageSetup() {
    themePage();
    var params = {
        fullscreen: false,
        fitted: true
    };
    elem = document.getElementById(`typing-game`);
    two = new Two(params).appendTo(elem);

    centerx = window.innerWidth / 2;
    centery = (window.innerHeight / 2) - window.innerHeight * .025;
    width = window.innerWidth * 0.90;
    height = window.innerHeight * .80;
    window.addEventListener('keydown', keydown, false);
    two.bind('resize', draw);
    getPrompt();
    displayResults = false;
    typing = false;
    showCursor = true;
    input = "";

    cursorCounter = 0;

    styles = {
        family: 'proxima-nova, sans-serif',
        size: 50,
        leading: 50,
        weight: 900
    };
}

function getPrompt() {
    // this will be handled by the server
    prompts = ["Hello world", "The quick brown fox jumps over the lazy dog", "lorem ipsum"];
    prompt = prompts[Math.floor(Math.random()*prompts.length)];
}


function updateVars() {
    centerx = window.innerWidth / 2;
    centery = (window.innerHeight / 2) - window.innerHeight * .025;
    width = window.innerWidth * 0.90;
    height = window.innerHeight * .80;
}

function curse() {
    if (!typing) {
        if (showCursor) {
            var cursorHeight = height * 0.1;
            var cursorWidth = cursorHeight * 0.1;
            var cursor = two.makeRoundedRectangle(centerx, centery, cursorWidth, cursorHeight, 5); 
            // Instead of white, make it themed
            cursor.fill = 'rgb(255,255,255)';
            cursor.opacity = 1;
            cursor.noStroke();
            showCursor = !showCursor;
        } else {
            draw();
            showCursor = !showCursor;
        }
    }

    two.update();
    setTimeout(curse, 500);
}

function draw() {
    updateVars();

    var rect = two.makeRoundedRectangle(centerx, centery, width, height, 5); 

    rect.fill = vars.backgroundColor;
    rect.opacity = 1;
    rect.noStroke();

    var promptText = two.makeText(prompt, centerx, centery, styles);
    promptText.fill = vars.textColor;
    promptText.noStroke();

    var userText = two.makeText(input, centerx, centery * 1.1, styles);
    userText.fill = vars.textColor;
    userText.noStroke();   

    if (displayResults) {
        texts = calculateTestStats();
        var resultsBackground = two.makeRoundedRectangle(centerx, centery, width / 2, height / 2, 5); 
        resultsBackground.fill = 'rgb(120, 236, 220)';
        resultsBackground.opacity = 1;
        resultsBackground.noStroke();
        var x = centerx;
        var y = centery;
        for (ele in texts) {
            var promptText = two.makeText(texts[ele], x, y, 'normal');
            y += 30;
        }
    }

    two.update();
}

function resetVars() {
    displayResults = false;
    typing = false;
    input = "";
    getPrompt();
}

function startTimer() {
    startTime = new Date();
}

function stopTimer() {
    endTime = new Date();
}

function calculateTestStats() {
    var toReturn = [];
    var elapsedTime = (endTime - startTime);
    var WPM = ((prompt.length / 5)/(elapsedTime / 1000)) * 100;
    toReturn.push(vars.testCompleteTexts[0]);
    toReturn.push(vars.testCompleteTexts[1] + (elapsedTime) / 1000 + "s");
    toReturn.push(vars.testCompleteTexts[2] + WPM);
    return toReturn;
}

function keydown(e) {
    if (e.keyCode === 8) { // Backspace
        if (input.length > 0) {
            input = input.substring(0,input.length - 1)
        }
        event.preventDefault();
    } else if (e.keyCode === 9) { // Tab
        resetVars();
        event.preventDefault();
    } else if (e.key.length === 1) {
        if (input.length <= prompt.length) {
            if (!typing) {
                typing = !typing;
                startTimer();
            }
            input += e.key;
            if (input.length == prompt.length && input.charAt(input.length - 1) === prompt.charAt(input.length - 1)) {
                // Finish test
                displayResults = true;
                stopTimer();
            }
        }
    }
    draw();
}

