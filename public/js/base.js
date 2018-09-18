document.onreadystatechange  = checkReady;
function checkReady() {
    if(document.readyState === 'complete'){
        completed();
    }
}
function completed() {
    var loadingEle = document.getElementById('markLoading')
    /*loadingEle.style.height = '0px';*/
    loadingEle.style.display = 'none';
    loadingEle.style.opacity = '0'
}