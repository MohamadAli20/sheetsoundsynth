$(document).ready(function(){
    /*display the image*/
    let filePath = localStorage.getItem("image");
    $("#image").attr("src", filePath);

    /*get the midi path*/
    let midiPath = localStorage.getItem("midiPath");
    getMidi(midiPath);

    $("#play").click(function(){
        go();
    });

    $("#stop").click(function(){
        stop();
    });

    $("#volume").change(function(){
        let volume = $("#volume").val();
        if(volume > 50){
            $(".volumes").find("img").attr("src", "/images/volume_up.svg");
        }
        else if(volume <= 50 && volume > 0){
            $(".volumes").find("img").attr("src", "/images/volume_down.svg");
        }
        else if(volume == 0){
            $(".volumes").find("img").attr("src", "/images/volume_off.svg");            
        }
    });

});