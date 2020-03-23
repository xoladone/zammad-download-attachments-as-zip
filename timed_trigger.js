// This is the timerbased trigger for special Ops in Zammad.
// To add this script to zammad insert js-scource file in the file:
// /opt/zammad/app/views/init/index.html.erb
// eg: <script src='timed_trigger.js'</script>
// defaultpath for additional sourcefiles is /opt/zammad/public/
// if you have problems with same-origin-policy visit: https://community.zammad.org/t/solved-set-x-frame-options-for-zammad-to-allow-iframe/2051/3

//  import { zip } from './fitools/js/jszip.js';


setInterval(callFunction, 1000);
$attachArr = [];  // musthave to just add one eventlistener per attachment paper clip

function callFunction() {
  // This is the masterfunction. Add all subfunction in here.
  zipAttachement();
}

function zipAttachement() {
  if (document.querySelectorAll('.attachments--list').length > 0) {
    let $attachments = document.querySelectorAll('.attachments--list');
    for (let $i=0; $i<$attachments.length; $i++) {
      let $files = $attachments[$i].querySelectorAll('[data-type=attachment]');
      let $icon = $attachments[$i].querySelectorAll('.icon-paperclip')[0];
      if ($attachArr[$i] != true) {
        $attachArr[$i] = true;
        $icon.onclick = function(event) {event.stopPropagation();zipDownload($i)};
      }
    }
  }

}


// ####################################################################################################
// # not time triggerd functions ######################################################################
// ####################################################################################################

let $arrayFull = new Array();

function zipDownload($number) {
  let $attachments = document.querySelectorAll('.attachments--list');
  let $files = $attachments[$number].querySelectorAll('[data-type=attachment]');
  for (let $i=0; $i<$files.length; $i++) {
    let $object = new Object();
    $object.origin = $files[$i].origin;
    $object.pathname = $files[$i].pathname;
    $object.origFileName = $files[$i].innerText.split(String.fromCharCode(10))[0];
    $arrayFull.push($object);
  }
  //console.log(($arrayFull));
  for (let $item in $arrayFull) {
    zipReadURL($arrayFull[$item]);
  }
}

function zipExecute() {
  var zip = new JSZip();
  for (let $item in $arrayFull) {
    let $fileData = $arrayFull[$item].base64;
    let $fileName = $arrayFull[$item].origFileName;
    zip.file($fileName, $fileData, {base64: true});
  }   
zip.generateAsync({type:"blob"})
.then(function (blob) {
    let $downloadName = "download_" +document.querySelector('.ticket-number').innerHTML + ".zip";
    saveAs(blob, $downloadName);
});
  $arrayFull = new Array();
}  

  
function zipCheckLoaded() {
  for (var $item in $arrayFull) {
    if (!("base64" in $arrayFull[$item])) {
      return;
    }
  }  
  zipExecute();
}  
  
  
function zipReadURL($object) {
var xhr=new XMLHttpRequest();
var $url=$object.pathname;
xhr.open("GET", $url, true);
//Now set response type
xhr.responseType = 'arraybuffer';
xhr.addEventListener('load',function(){
  if (xhr.status === 200){
    zipGetBase64(new Blob([xhr.response]), $object);
//    console.log(xhr.response) // ArrayBuffer
//    console.log(new Blob([xhr.response])) // Blob
  }
});
xhr.send();  
}

function zipGetBase64($file, $object) {
   var reader = new FileReader();
   reader.readAsDataURL($file);
   reader.onload = function () {
     $object.base64 = reader.result.split(",")[1];
     zipCheckLoaded();
//     console.log($object.base64);
//     console.log(reader.result);
   };
   reader.onerror = function (error) {
     console.log('Error: ', error);
   };
}
