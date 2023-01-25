// *********************************************************************
// * VARIABLES AND CONSTANTS *
// *********************************************************************
//TODO: Add check questions and resize functions
var iSlideIndex     = 0;            // Which slide is active
var tBefore, tNow, tStart;          // timers
var inputSlideSeq, inputSlideTim;   // inputs
var lSlides, lDots;                 // list of slides and buttons below

// *********************************************************************
// * WHEN LOADING PAGE *
// *********************************************************************

document.addEventListener("DOMContentLoaded", ()=> {
    tStart          = new Date().getTime();                             // Start Timer
    lSlides     = document.getElementsByClassName("slide");
    for (let i=0; i<lSlides.length; i++){
        lSlides[i].id = `slide-${i}`;
        addSpan(i);
    }
    lDots     = document.getElementsByClassName("dot");
    // adjustElem(slides[iSlideIndex]);                // adjust slide size
    inputSlideSeq   = document.getElementById('sSlideSequence');
    inputSlideTim   = document.getElementById('sSlideTime');
    activeSlide();
});


// *********************************************************************
// * KEYPRESS COMMANDS *
// *********************************************************************
document.addEventListener('keydown', (event) => {
    let keypress = event.key;
    switch (keypress) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            plusSlides(-1);
            break;
        case 'ArrowRight':
        case 'D':
        case 'd':
            plusSlides(1);
            break;
        default:
            break;
    }

});

// *********************************************************************
// * FUNCTIONS FOR MOVING SLIDES *
// *********************************************************************
// *********************************************************************
// Function Name:   activeSlide
// Functionality:   
//                  1. activates slide depending on iSlideindex
//
// input:           void
//
// returns:         void
// *********************************************************************

function activeSlide() {
    hideSlides();
    lSlides[iSlideIndex].classList.remove('inactive');
    lDots[iSlideIndex].classList.add('active');
}
// *********************************************************************
// Function Name:   currentSlide
// Functionality:   
//                  1. advances slides 'i' slides
//
// input:           i: integer (positive or negative)
//
// returns:         void
// *********************************************************************

function plusSlides(i) {
    if (canMove()) {
        let iSlide = iSlideIndex + i;
        if (iSlide>=lSlides.length){iSlide=lSlides.length-1}; // upper limit
        if (iSlide<0){iSlide=0}; // upper limit
        currentSlide(iSlide)
    }
}
// *********************************************************************
// Function Name:   currentSlide
// Functionality:   
//                  1. activates specific slide
//
// input:           i: integer denoting slide index
//
// returns:         void
// *********************************************************************

function currentSlide(i) {
    iSlideIndex = i;
    activeSlide();
}
// *********************************************************************
// Function Name:   hideSlides
// Functionality:   
//                  1. Hides all slides
//
// input:           void
//
// returns:         void
// *********************************************************************
function hideSlides() {
    for (let i =0; i<lSlides.length;i++) {
        lSlides[i].classList.add('inactive');
        lDots[i].classList.remove('active');
    }
}
// *********************************************************************
// * AUXILIARY FUNCTIONS *
// *********************************************************************

// *********************************************************************
// * Please add here any constraints for the slides. 
// * For example: Participants do something special before they can move the slides again
// Function Name:   canMove
// Functionality:   
//                  1. Checks if slides can be passed
//
// input:           void
//
// returns:         boolean
// *********************************************************************

if (typeof canMove==='undefined') {
    function canMove(slide=iSlideIndex) {
        return true;
    };
}

// *********************************************************************
// Function Name:   addSpan
// Functionality:   
//                  1. draws a span that activates slide i when clicked
//
// input:           i: integer denoting slide index
//
// returns:         void
// *********************************************************************

function addSpan(i) {
    let Dot = document.createElement('span');
    Dot.classList.add('dot');
    Dot.onclick = ()=>{currentSlide(i)};
    document.getElementById('spans').append(Dot);
}

// *********************************************************************
// Function Name:   validateAnswers
// Functionality:   
//                  1. checks answers and displays hints if available
//
// input:           void
//
// returns:         void
// *********************************************************************
function hideHints() {
    let lHints      = document.getElementsByClassName("hint");                          // make array of hints
    if (lHints!==undefined){
        for (i = 0; i < lHints.length; i++) { 
            lHints[i].classList.add('hidden');
        }
    }
}

function showHint(iQuestion) {
    let lHints      = document.getElementsByClassName("hint"); 
    if (lHints!=undefined) {
        lHints[iQuestion].classList.remove('hidden');
    }                        
}

function validateAnswers() {
    hideHints();
    // Are there correct answers?
    if (lCorrect!== undefined) {
        let lQuestions  = document.getElementsByClassName("ControlQuestions");              // make array of questions
        let lHints      = document.getElementsByClassName("hint");                          // make array of hints
        let iCorrect    = 0;                                                                // initialize counter for correct answers
        for (i = 0; i < lQuestions.length; i++) {                                           // iterate through answers
            if (lQuestions[i].value !== lSolutions[i] || lQuestions[i].value === null) {    // incorrect or empty field
                showHint(i);                                 // Show Hint
            } else {
                iCorrect +=1;                                                               // iCorrect: increase counter
            }
        }
        
        if (iCorrect === lQuestions.length) {                                               // if all correct, Submit
            now = new Date().getTime(); 
            inputSlideSeq.value += iSlideIndex;
            inputSlideTim.value += now - before;
            document.getElementById("form").submit();
        }
    }


}

// // *********************************************************************
// // Function Name:   checkOverflow
// // Functionality:   
// //                  1. Checks if content is overflowing
// //
// // input:           elem, element to check if has overflow
// //
// // returns:         boolean, true if overflow
// // *********************************************************************

// document.addEventListener('resize',()=>{
//     for (let i=0; i<lSlides.length; i++){
//         fitSlide(lSlides[i]);
//     }
// })

// function checkOverflowV(elem) {
//     let overflow = elem.clientHeight < elem.scrollHeight;
//     return overflow;
// };

// function fitSlide(slide) {
//     dFontSize = parseFloat(window.getComputedStyle(slide, null).getPropertyValue('font-size').replace('px',''));
//     while (checkOverflowV(slide)) {
//         dFontSize = 0.99*dFontSize;
//         slide.style.fontSize = `${dFontSize}px`;
//     }
// }



