$(document).ready(function(){
    /*trigger the input type file once button is clicked*/
    $("#browse_file").click(function(){
        $("input[type='file']").trigger('click');
    });
    /*display selected image*/
    $("input[type='file']").change(function(event){
        /*remove the default children*/
        $("#file_upload").css('display', 'none');
        handleDisplayImage(event);        
        $(".buttons").css("display", "flex");
    });
    /*change selected image*/
    $("#btn_convert").click(function(){
        convertToMidi();
    });
    /*clear selected images*/
    $("#clear").click(function(){
        $(".custom_main_dash > figure").remove();
        $("#file_upload").css('display', 'block');
        stop();        
    });
    $("#play").click(function(){
        go();
    });
    $("#stop").click(function(){
        stop();
    });
    $("#save_music").click(function(){
        saveMusic();
    });
    

    let handleDisplayImage = (event) => {
        let files = event.target.files;

        for(let i = 0; i < files.length; i++){
            let figure = document.createElement('figure');
            figure.style.width = '70%';
            figure.style.border = '1px solid black';
            figure.style.margin = '20px auto';

            let image = document.createElement('img');
            image.className = "uploaded_image"
            image.setAttribute('src', URL.createObjectURL(files[i]));
            image.style.width = '100%';
            figure.appendChild(image);
            $(".custom_main_dash").append(figure);
        }
    }

    /*send image in flask server*/
    let convertToMidi = () => {
        $("#loading").css("display", "block");
        var formData = new FormData();
        var files = $('#file_input')[0].files;

        for (var i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $("#image_path").val(response.imagePath);
                $("#midi_path").val(response.midiPath);
                $("#loading").css("display", "none");
                getMidi();
            },
            error: function (xhr, status, error) {
                console.error('Upload failed' + error);
            }
        });
    }

    let saveMusic = () => {
        let pathImage = $("#image_path").val();
        let pathMidi = $("#midi_path").val();
        $.ajax({
            url: "/save_music",
            type: "POST",
            data: {pathImage, pathMidi},
            success: function(response){
                console.log(response);
            },
            error: function(xhr, status, error){
                console.error(error);
            }
        })
    }
});