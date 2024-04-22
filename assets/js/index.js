$(document).ready(function(){
    /*trigger the input type file once 'Choose File' is clicked*/
    $("#browse_file").click(function(){
        $("input[type='file']").trigger('click');
    });
    $("input[type='file']").change(function(event){
        $(".btn_upload").css('display', 'inline-block');
        $("#browse_file").css('background-color', "#A4A1A6");
        let fileName = $(this).val().split('\\').pop(); /*get the file name*/
        $('#filename').text(fileName); /*display file name next to the button*/

        handleUploadedImage(event);
    });
    $(".btn_upload").click(function(){
        $(".loader_background").css("display", "block");
        convertToMidi();
    })

    /*
    * Functions
    */

    /*store image in the local storage*/
    let handleUploadedImage = (event) => {

        let file = event.target.files[0];
        if (file) {
            let reader = new FileReader();

            reader.onload = function(event) {
                let dataURL = event.target.result;
                localStorage.setItem('image', dataURL);
            };
            reader.readAsDataURL(file);
        }
    }
    /*send image in flask server*/
    let convertToMidi = () => {
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
                console.log(response);
                localStorage.setItem("imagePath", response.imagePath);
                localStorage.setItem("midiPath", response.midiPath);
                window.location.href = '/playground';
            },
            error: function (xhr, status, error) {
                console.error('Upload failed' + error);
            }
        });
    }
});