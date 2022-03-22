/// <reference path="../Resources/dynamsoft.webtwain.intellisense.js" />

var _iLeft, _iTop, _iRight, _iBottom, bNotShowMessageAgain = false; //These variables are used to remember the selected area
            
function pageonload() {
    HideLoadImageForLinux();
    initCustomScan();       //CustomScan
    
    var twainsource = document.getElementById("source");          
    if (twainsource) {
        twainsource.options.length = 0;
        twainsource.options.add(new Option("Looking for devices.Please wait.", 0));
        twainsource.options[0].selected = true; 
    }

    initiateInputs();
}

function HideLoadImageForLinux()
{
    var btnLoad = document.getElementById("btnLoad");
    if (btnLoad) {
        if (Dynamsoft.Lib.env.bLinux)
            btnLoad.style.display = "none";
        else
            btnLoad.style.display = "";
    }

    var btnSave = document.getElementById("btnSave");
    if (btnSave) {
        if (Dynamsoft.Lib.env.bLinux)
            btnSave.style.display = "none";
        else
            btnSave.style.display = "";
    }
}

function initCustomScan() {
    var ObjString = "";
    ObjString += "<ul id='divTwainType'> ";
    ObjString += "<li>";
    ObjString += "<label style='width: 165px;' id ='lblShowUI' for = 'ShowUI'><input type='checkbox' id='ShowUI' />Show Scanner UI&nbsp;</label>";
    ObjString += "<label for = 'ADF'><input type='checkbox' id='ADF' />Use ADF&nbsp;</label></li>";
    ObjString += "<li><label style='width: 165px;' for = 'DiscardBlankPage'><input type='checkbox' id='DiscardBlankPage'/>Auto Remove Blank Page</label>";
    ObjString += "<label for = 'Duplex'><input type='checkbox' id='Duplex'/>2-sided Scan</label></li>";
    ObjString += "<li>Pixel Type:";
    ObjString += "<label for='BW' style='margin-left:5px;' class='lblPixelType'><input type='radio' id='BW' name='PixelType'/>B&amp;W </label>";
    ObjString += "<label for='Gray' class='lblPixelType'><input type='radio' id='Gray' name='PixelType'/>Gray</label>";
    ObjString += "<label for='RGB' class='lblPixelType'><input type='radio' id='RGB' name='PixelType'/>Color</label></li>";
    ObjString += "<li>";
    ObjString += "<span>Resolution:</span><select size='1' id='Resolution'><option value = ''></option></select></li>";
    ObjString += "</ul>";

    if (document.getElementById("divProductDetail"))
        document.getElementById("divProductDetail").innerHTML = ObjString;

    var vResolution = document.getElementById("Resolution");
    if (vResolution) {
        vResolution.options.length = 0;
        vResolution.options.add(new Option("100", 100));
        vResolution.options.add(new Option("150", 150));
        vResolution.options.add(new Option("200", 200));
        vResolution.options.add(new Option("300", 300));

        vResolution.options[2].selected = true;
    }

    var _divMessageContainer = document.getElementById("DWTemessage");
    _divMessageContainer.ondblclick = function () {
        this.innerHTML = "";
        _strTempStr = "";
    }
  
}

function initiateInputs() {

    var allinputs = document.getElementsByTagName("input");
    for (var i = 0; i < allinputs.length; i++) {
        if (allinputs[i].type == "checkbox") {
            allinputs[i].checked = false;
        }
        else if (allinputs[i].type == "text") {
            allinputs[i].value = "";
        }
    }

    if (Dynamsoft.Lib.env.bIE == true && Dynamsoft.Lib.env.bWin64 == true) {
        var o = document.getElementById("samplesource64bit");
        if(o)
            o.style.display = "inline";

        o = document.getElementById("samplesource32bit");
        if(o)
            o.style.display = "none";
    }
}

function setDefaultValue() {
    var vGray = document.getElementById("Gray");
    if(vGray)
        vGray.checked = true;
 
    var varImgTypepng2 = document.getElementById("imgTypepng2");
    if (varImgTypepng2)
        varImgTypepng2.checked = true;
    var varImgTypepng = document.getElementById("imgTypepng");
    if (varImgTypepng)
        varImgTypepng.checked = true;

    var _strDefaultSaveImageName = "WebTWAINImage";
    var _txtFileNameforSave = document.getElementById("txt_fileNameforSave");
    if(_txtFileNameforSave)
        _txtFileNameforSave.value = _strDefaultSaveImageName;

    var _txtFileName = document.getElementById("txt_fileName");
    if(_txtFileName)
        _txtFileName.value = _strDefaultSaveImageName;

    if(document.getElementById("ADF"))
        document.getElementById("ADF").checked = true;
}

function initFileType() {
    var fileType = document.getElementById("fileType");
    fileType.options.length = 0;
    fileType.options.add(new Option("pdf", "pdf"));
    fileType.options.add(new Option("tif", "tif"));
    fileType.options.add(new Option("jpg", "jpg"));
    fileType.options.add(new Option("png", "png"));
    fileType.options.add(new Option("bmp", "bmp"));

    fileType.selectedIndex = 0;

    var vAllPages = document.getElementById("AllPages");
    if (vAllPages)
        vAllPages.checked = true;
}


var DWObject;            // The DWT Object
var DWTSourceCount = 0;
var currentIndex = -1;

// Check if the control is fully loaded.
function Dynamsoft_OnReady() {

    var liNoScanner = document.getElementById("pNoScanner");
    // If the ErrorCode is 0, it means everything is fine for the control. It is fully loaded.
    DWObject = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');  
    if (DWObject) {
        if (DWObject.ErrorCode == 0) {
            var thumbnailViewer = DWObject.Viewer.createThumbnailViewer();
            thumbnailViewer.size = "180px";
            thumbnailViewer.showPageNumber = true;
            thumbnailViewer.selectedPageBackground = thumbnailViewer.background;
            thumbnailViewer.selectedPageBorder = "solid 2px #FE8E14"; 
            thumbnailViewer.hoverPageBorder = "solid 2px #FE8E14";
            thumbnailViewer.placeholderBackground = "#D1D1D1";
            thumbnailViewer.show();
            thumbnailViewer.hoverPageBackground = thumbnailViewer.background;
            thumbnailViewer.on("click", Dynamsoft_OnMouseClick);
            thumbnailViewer.on('dragdone', Dynamsoft_OnIndexChangeDragDropDone);
            thumbnailViewer.on("keydown", Dynamsoft_OnKeyDown);
            DWObject.Viewer.on("wheel", Dynamsoft_OnMouseWheel);  //H5 only
            DWObject.Viewer.on("OnPaintDone", Dynamsoft_OnMouseWheel);   //ActiveX only

            DWObject.Viewer.allowSlide = false;
            $('#DWTNonInstallContainerID').hide();

            DWObject.IfAllowLocalCache = true;
            DWObject.ImageCaptureDriverType = 4;
            setDefaultValue();
            initFileType();          

            var twainsource = document.getElementById("source");
            if (!twainsource) {
                twainsource = document.getElementById("webcamsource");
            }

            var vCount = DWObject.SourceCount;
            DWTSourceCount = vCount;
            var strSourceName = "";

            if (twainsource) {
                twainsource.options.length = 0;
                for (var i = 0; i < vCount; i++) {
                    twainsource.options.add(new Option(DWObject.GetSourceNameItems(i), i));
                    if (i > 0)
                        strSourceName = strSourceName + ";" + DWObject.GetSourceNameItems(i);
                    else
                        strSourceName = DWObject.GetSourceNameItems(i);
                }
            }

            if (vCount == 0) {
                if (!Dynamsoft.navInfo.bMips64)
                    btnDownloadImages_onclick();
            }

            // If source list need to be displayed, fill in the source items.
            if (vCount == 0) {
                if (liNoScanner) {
                    if (Dynamsoft.Lib.env.bWin) {

                            liNoScanner.style.display = "block";
                            liNoScanner.style.textAlign = "center";
                    }
                    else
                        liNoScanner.style.display = "none";
                }
            }

            if (vCount > 0) {
                source_onchange(false);
            }

            var btnScan = document.getElementById("btnScan");
            if(btnScan) {
                if (vCount == 0)
                    document.getElementById("btnScan").disabled = true;
                else {
                    document.getElementById("btnScan").disabled = false;
					var btnScan = $("#btnScan");
					if (btnScan)
					    btnScan.addClass('btnScanActive');
            }
        }


            if (!Dynamsoft.Lib.env.bWin && vCount > 0) {
                if (document.getElementById("lblShowUI"))
                    document.getElementById("lblShowUI").style.display = "none";
                if (document.getElementById("ShowUI"))
                document.getElementById("ShowUI").style.display = "none";
            }
            else {
                if(document.getElementById("lblShowUI"))
                    document.getElementById("lblShowUI").style.display = "";
                if (document.getElementById("ShowUI"))
                    document.getElementById("ShowUI").style.display = "";
            }

            if(document.getElementById("ddl_barcodeFormat")) {
                 for (var index = 0; index < BarcodeInfo.length; index++)
                    document.getElementById("ddl_barcodeFormat").options.add(new Option(BarcodeInfo[index].desc, index));
                 document.getElementById("ddl_barcodeFormat").selectedIndex = 0;
            }

            re = /^\d+$/;
            strre = /^[\s\w]+$/;
            refloat = /^\d+\.*\d*$/i;

            _iLeft = 0;
            _iTop = 0;
            _iRight = 0;
            _iBottom = 0;

            for (var i = 0; i < document.links.length; i++) {
                if (document.links[i].className == "ClosetblLoadImage") {
                    document.links[i].onclick = closetblLoadImage_onclick;
                }
            }
            if (vCount == 0) {
                if (Dynamsoft.Lib.env.bWin) {

                    if (window['bDWTOnlineDemo']) {
                        if(document.getElementById("div_ScanImage").style.display == "")
                            showtblLoadImage_onclick();
                    }
                    if(document.getElementById("Resolution"))
                        document.getElementById("Resolution").style.display = "none";

                }
            }
            else {
                var divBlank = document.getElementById("divBlank");
                if(divBlank)
                    divBlank.style.display = "none";
            }

            updatePageInfo();
            if (!ua.indexOf("msie 6.0")) {
                ShowSiteTour();
            }

            DWObject.RegisterEvent('CloseImageEditorUI', Dynamsoft_CloseImageEditorUI);
            DWObject.RegisterEvent('OnBitmapChanged', Dynamsoft_OnBitmapChanged);
            DWObject.RegisterEvent("OnPostTransfer", Dynamsoft_OnPostTransfer);
            DWObject.RegisterEvent("OnPostLoad", Dynamsoft_OnPostLoadfunction);
            DWObject.RegisterEvent("OnPostAllTransfers", Dynamsoft_OnPostAllTransfers);
            DWObject.RegisterEvent("OnGetFilePath", Dynamsoft_OnGetFilePath);
            DWObject.Viewer.on("pageAreaSelected", Dynamsoft_OnImageAreaSelected);
            DWObject.Viewer.on("pageAreaUnselected", Dynamsoft_OnImageAreaDeselected);
        }
    }

    if (typeof (window['start_init_dcs']) == 'function')
    {
        window['start_init_dcs']();
    }
}


function showtblLoadImage_onclick() {
    switch (document.getElementById("tblLoadImage").style.visibility) {
        case "hidden": document.getElementById("tblLoadImage").style.visibility = "visible";
            document.getElementById("Resolution").style.visibility = "hidden";
            break;
        case "visible":
            document.getElementById("tblLoadImage").style.visibility = "hidden";
            document.getElementById("Resolution").style.visibility = "visible";
            break;
        default: break;
    }

    return false;
}

function closetblLoadImage_onclick() {
    document.getElementById("tblLoadImage").style.visibility = "hidden";
    document.getElementById("Resolution").style.visibility = "visible";
    return false;
}

//--------------------------------------------------------------------------------------
//************************** Used a lot *****************************
//--------------------------------------------------------------------------------------
function updatePageInfo() {
    if(document.getElementById("DW_TotalImage"))
        document.getElementById("DW_TotalImage").value = DWObject.HowManyImagesInBuffer;
    if(document.getElementById("DW_CurrentImage"))
        document.getElementById("DW_CurrentImage").value = DWObject.CurrentImageIndexInBuffer + 1;
    updateZoomInfo();
}

function updateZoomInfo() {
    if(document.getElementById("DW_spanZoom")) {
        if(DWObject.HowManyImagesInBuffer == 0)
            document.getElementById("DW_spanZoom").value = "100%";
        else 
            document.getElementById("DW_spanZoom").value = Math.round(DWObject.Viewer.zoom * 100) + "%";
    }
}


var _strTempStr = "";       // Store the temp string for display
function appendMessage(strMessage) {
    _strTempStr += strMessage;
    var _divMessageContainer = document.getElementById("DWTemessage");
    if (_divMessageContainer) {
        _divMessageContainer.innerHTML = _strTempStr;
        _divMessageContainer.scrollTop = _divMessageContainer.scrollHeight;
    }
}

function checkIfImagesInBuffer() {
    if (DWObject.HowManyImagesInBuffer == 0) {
        appendMessage("<span style='color:#cE5E04'><b>There is no image in buffer.</b></span><br />")
        return false;
    }
    else
        return true;
}

function checkErrorString() {
    return checkErrorStringWithErrorCode(DWObject.ErrorCode, DWObject.ErrorString);
}

function checkErrorStringWithErrorCode(errorCode, errorString, responseString) {
    if (errorCode == 0) {
        appendMessage("<span style='color:#cE5E04'><b>" + errorString + "</b></span><br />");

        return true;
    }
    if (errorCode == -2115) //Cancel file dialog
        return true;
    else {
        if (errorCode == -2003) {
            var ErrorMessageWin = window.open("", "ErrorMessage", "height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
            ErrorMessageWin.document.writeln(responseString); //DWObject.HTTPPostResponseString);
        }
        appendMessage("<span style='color:#cE5E04'><b>" + errorString + "</b></span><br />");
        return false;
    }
}

function enableButtonForCrop(bEnable) {
    if (bEnable) {
        var btnCrop = document.getElementById("btnCrop");
        if (btnCrop)
            btnCrop.style.display = "";
        var btnCropGray = document.getElementById("btnCropGray");
        if (btnCropGray)
            btnCropGray.style.display = "none";
    } else {
        var btnCrop = document.getElementById("btnCrop");
        if (btnCrop)
            btnCrop.style.display = "none";
        var btnCropGray = document.getElementById("btnCropGray");
        if (btnCropGray)
            btnCropGray.style.display = "";
    }
}

function showCustomInfo() {
    var customDetail = document.getElementById("customDetail");
    customDetail.style.display = "";
}

function hideCustomInfo() {
    var customDetail = document.getElementById("customDetail");
    customDetail.style.display = "none";
}

function showUploadedFilesDetail() {
    var customDetail = document.getElementById("uploadedFilesDetail");
    customDetail.style.display = "";
}

function hideUploadedFilesDetail() {
    var customDetail = document.getElementById("uploadedFilesDetail");
    customDetail.style.display = "none";
}

//--------------------------------------------------------------------------------------
//************************** Used a lot *****************************
//--------------------------------------------------------------------------------------
function ds_getleft(el) {
    var tmp = el.offsetLeft;
    el = el.offsetParent
    while (el) {
        tmp += el.offsetLeft;
        el = el.offsetParent;
}
    return tmp;
}

function ds_gettop(el) {
    var tmp = el.offsetTop;
    el = el.offsetParent
    while (el) {
        tmp += el.offsetTop;
        el = el.offsetParent;
    }
    return tmp;
}

function Over_Out_DemoImage(obj, url) {
    obj.src = url;
}


