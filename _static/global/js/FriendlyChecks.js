
var bRequireFS    = isThere('js_vars.bRequireFS',false);
var bCalibrate    = isThere('js_vars.bCalibrate',false);
var bCheckFocus   = isThere('js_vars.bCheckFocus',false);
var dDefaultPixel = isThere('js_vars.dPixelRatio',undefined);
var Varnames      = isThere('js_vars.Varnames',{
  iFS:'iFullscreenChange',
  iFL:'iFocusLost',
  dFT:'dFocusLostT',
  dDP:'dPixelRatio'});
var sBodyName     = isThere('js_vars.sBodyID','page-content');
var GameBody      = document.getElementById(sBodyName);


if (bCheckFocus) {
  var TBlur           = new Date().getTime();
  var TFocus          = new Date().getTime();
  var tStart,tNow;
  var FocusLost,FocusLostT
}

if (bRequireFS) {
  var FullscreenChange;
}

if (bCalibrate) {
  var DefaultPixel;
  var bCalibrated = false;
}


document.addEventListener('DOMContentLoaded',()=>{
  tStart          = new Date().getTime();
  if (bCalibrate) {
    console.log('calibrating');
    InitializeCalibration();
  } else {
    console.log('Friendly Checks');
    InitializeFriendlyChecks();             // Initialize FS and focus checks
  }
})

function isThere(sVar,defaultValue=undefined) {
  let actualVar;
  try {
    actualVar = eval(sVar);
  } catch (e) {
      if (e instanceof ReferenceError) {
          // Handle error as necessary
          actualVar = defaultValue;
      }
  }
  if (actualVar===undefined) {actualVar=defaultValue}
  return actualVar
}
// ----------------------------------------------------- //
//  Function:       1. Initializes Fullscreen and Focus checks
//
//  Input:          GameBody: (html object) container of the game
//                  bRequireFS: (boolean) true if require Fullscreen Check
//                  bCheckFocus: (boolean) true if require Focus Check
// 
// ----------------------------------------------------- //

function InitializeFriendlyChecks() {
  // If Fullscreen is required
  if (bRequireFS) {
    console.log('Checking for Fullscreen')
    FullscreenChange       = document.createElement("input");
    FullscreenChange.type      = 'hidden';
    FullscreenChange.name      = Varnames.iFS;
    FullscreenChange.id        = Varnames.iFS;
    FullscreenChange.value     = 0;
    GameBody.appendChild(FullscreenChange);
    CreateFullScreenPopUp();
    CheckFS();
    // Event Listener for changing screen size
    window.addEventListener('resize',  CheckFS);
  }
  // If CheckFocus is required
  if (bCheckFocus) {
    // Create input iFocusLost
    FocusLost            = document.createElement("input");
    FocusLost.type       = 'hidden';
    FocusLost.name       = Varnames.iFL;
    FocusLost.id         = Varnames.iFL;
    FocusLost.value      = 0;
    // Create input dFocusLostT
    FocusLostT        = document.createElement("input");
    FocusLostT.type       = 'hidden';
    FocusLostT.name       = Varnames.dFT;
    FocusLostT.id         = Varnames.dFT;
    FocusLostT.value      = 0;
    // Create input Create Timer variables
    GameBody.appendChild(FocusLost);
    GameBody.appendChild(FocusLostT);
    // Event Listener for gaining and losing focus on the page
    window.addEventListener('blur', pause);
    window.addEventListener('focus', play);
  }
}

// ----------------------------------------------------- //
//  Function:       1. Initializes Calibration Page
//
//  Input:          GameBody: (html object) container of the game
//                  
// 
// ----------------------------------------------------- //

function InitializeCalibration() {

  FullscreenChange       = document.createElement("input");
  FullscreenChange.type      = 'hidden';
  FullscreenChange.name      = Varnames.iFS;
  FullscreenChange.id        = Varnames.iFS;
  FullscreenChange.value     = 0;
  GameBody.appendChild(FullscreenChange);
  DefaultPixel           = document.createElement("input");
  DefaultPixel.type      = 'hidden';
  DefaultPixel.name      = Varnames.dDP;
  DefaultPixel.id        = Varnames.dDP;
  DefaultPixel.value     = 1;
  GameBody.appendChild(DefaultPixel);
  CreateFullScreenPopUp(true);
  CalibrateCheck();
  // Event Listener for changing screen size
  window.addEventListener('resize',  () => {
    if (bCalibrated) {
      CheckFS();
    } else {
      CalibrateCheck();
    }
  });
}


// ----------------------------------------------------- //
//  Function:       1. Starts recording a pausing timer
//                  2. Adds 1 to the LossFocusCounter
// ----------------------------------------------------- //
function pause() {
  console.log('FOCUS LOST!');
  FocusLost.value  = +FocusLost.value+1;
  TBlur             = new Date().getTime();
}
// ----------------------------------------------------- //
//  Function:       1. Stops recording a pausing timer
//                  2. 
// ----------------------------------------------------- //
function play() {
  TFocus            = new Date().getTime();
  console.log('Focus back');
  let dt            = TFocus-TBlur;
  FocusLostT.value = +FocusLostT.value+dt;
}
// ----------------------------------------------------- //
//  Function:       1. Check if Fullscreen
//                  2. Display Fullscreen Pop-up Warning
// ----------------------------------------------------- //

function CalibrateCheck() {
  console.log("Checking fullscreen");
  let PopUp = document.getElementById('cal-popup');
  if ( window.fullScreen || window.innerHeight==screen.height ) {
    // Dissappear Screen and Text
    console.log('FullScreen');
    PopUp.style.visibility          = 'hidden';
    PopUp.style.zIndex              = -1;
    if (!bCalibrated) {
      DefaultPixel.value              = window.devicePixelRatio;
    }
    CreateFullScreenPopUp()
    bCalibrated = true;
  } else {
    // Make cover and text visible
    console.log('Not FullScreen');
    FullscreenChange.value         = +FullscreenChange.value+1; 
    PopUp.style.visibility          = 'visible';
    PopUp.style.zIndex              = 100;
  }
};

// ----------------------------------------------------- //
//  Function:       1. Check if Fullscreen
//                  2. Display Fullscreen Pop-up Warning
// ----------------------------------------------------- //

function CheckFS() {
  console.log("Checking fullscreen");
  let PopUp = document.getElementById('fs-popup');
  let adj;
  if (typeof dDefaultPixel!=='undefined') {
    adj = dDefaultPixel;
  } else {
    adj = parseFloat(DefaultPixel.value);
  }
  if ( window.fullScreen || Math.abs(window.innerHeight*window.devicePixelRatio/adj-screen.height)<=10 ) {
    // Dissappear Screen and Text
    console.log('FullScreen');
    PopUp.style.visibility          = 'hidden';
    PopUp.style.zIndex              = -1;

  } else {
    // Make cover and text visible
    console.log('Not FullScreen');
    FullscreenChange.value         = +FullscreenChange.value+1; 
    PopUp.style.visibility          = 'visible';
    PopUp.style.zIndex              = 100;
  }
};
// ----------------------------------------------------- //
//  Function:       1. Create FullScreen Pop-Up Warning
//                      with id='fs-popup'
// ----------------------------------------------------- //
function CreateFullScreenPopUp(bReqCalibrate=false) {
  let isSafari                    = (
    /constructor/i.test(window.HTMLElement) || 
    (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] ||
    (typeof safari !== 'undefined' && window['safari'].pushNotification)));
  let os = getOS();
  if (isSafari) {os = 'Safari'   }

  // Create Div fullscreen and Button 
  let PopUp                         = document.createElement('div');
  let PopUpText1                    = document.createElement('p');
  let PopUpText2                    = document.createElement('p');
  let PopUpText3                    = document.createElement('p');
  let PopUpText4                    = document.createElement('p');

  // Div Properties
  if (bReqCalibrate) {
    PopUp.id                        = 'cal-popup';
  } else {
    PopUp.id                        = 'fs-popup';
  }
  // Text Properties
  PopUpText1.className              = 'fs-popup-text';
  PopUpText2.className              = 'fs-popup-text';
  PopUpText3.className              = 'fs-popup-text';
  PopUpText4.className              = 'fs-popup-text';
  
  // Text content
  PopUpText1.innerHTML              = 'Please set display to Full Screen.';
  PopUpText3.innerHTML              = 'Please adjust the zoom of the screen to 100%.';

  switch (os) {
    case 'Mac OS' : 
      PopUpText2.innerHTML          = 'In the menu above go to View > Enter Full Screen. <br> Also in View > Unclick "Always show toolbar in Fullscreen".'; 
      PopUpText4.innerHTML          = 'Press ⌥,⌘,= (option, command, equal to zoom-in) <br> ⌥,⌘,- ( option, command, minus to zoom-out) ';
      break;
    case 'Safari':
      PopUpText2.innerHTML          = 'In the menu above go to View > Enter Full Screen. <br> Also in View > Unclick "Always show toolbar in Fullscreen".'; 
      PopUpText4.innerHTML          = 'Press ⌘,+ (command, plus to zoom-in) <br> ⌘,- ( command, minus to zoom-out) ';
      break;  
    case 'Windows' :
      PopUpText2.innerHTML          = 'Press F11'; 
      PopUpText4.innerHTML          = 'Press Ctrl,= (Control, equal to zoom-in) <br> Ctrl,-( Control, minus to zoom-out) '

      break;
    case 'Linux' :
        PopUpText2.innerHTML             = 'Press F11'; 
        PopUpText4.innerHTML             = 'Press Ctrl,= (Control, equal to zoom-in) <br> Ctrl,-( Control, minus to zoom-out) '
        break;
  };

  PopUp.appendChild(PopUpText1);
  PopUp.appendChild(PopUpText2);
  if (bReqCalibrate) {
    PopUp.appendChild(PopUpText3);
    PopUp.appendChild(PopUpText4);
  }

  document.body.appendChild(PopUp);
}

// ----------------------------------------------------- //
//  Function:       Determines Operative System:
//                  Mac OS
//                  iOS
//                  Windows
//                  Android
//                  Linux
// ----------------------------------------------------- //
function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

