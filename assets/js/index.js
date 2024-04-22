$(document).ready(function(){
    /* show and remove login modal*/
    $(".btn_login").click(function(){
        console.log("jdfhdf");
        $(".login_background").css("display", "block");
    });
    $(".login_form").submit(function(e){
        e.preventDefault();
        window.history.replaceState({}, document.title, "/login_account");
        let formData = $(this).serialize();
        console.log(formData);
        $.ajax({
            url: "/login_account",
            type: "POST",
            data: formData,
            success: function(response){
                if(typeof response === "string"){
                    $("#message").text(response);
                }
                else if(typeof response === "object"){
                    localStorage.setItem("username", response.name);
                    redirectHome();            
                }
            },
            error: function(xhr, status, error){
                console.error(error);
            }
        })
    })
    $(".btn_cancel").click(function(e){
        e.preventDefault();
        $(".login_background").css("display", "none");
        /*clear the message warning in the login modal*/
        $("#message").text("");
    });
    let redirectHome = () => {
        window.location.href = "/";
    }

    
    let checkUsername = () => {
        let username = localStorage.getItem("username");
        if(username !== null){
            /*hide login and sign up*/
            $(".buttons .btn_login").css("display", "none");
            $(".buttons a").css("display", "none");
            /*add username and logout button*/
            let p = document.createElement("p");
            p.textContent = username;
            p.style.display ="inline-block";
            p.style.backgroundColor = "red";
            p.style.paddingBottom = 0;
            $(".buttons").append(p);

            let button = document.createElement("button");
            button.className = "btn custom_signup my-2 my-sm-0"
            button.textContent = "Logout";
            button.style.display = "inline-block";
            $(".buttons").append(button);
        }
    }
    checkUsername();
    
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