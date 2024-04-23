$(document).ready(function(){
    /* show and remove login modal*/
    $(".btn_login").click(function(){
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
                    localStorage.setItem("user_id", response.id);
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

    /*check if user is logged in or not*/    
    let checkUsername = () => {
        let username = localStorage.getItem("username");
        if(username !== null){
            /*hide login and sign up*/
            $(".buttons .btn_login").css("display", "none");
            $(".buttons #btn_signup").css("display", "none");
            
            /*show username and logout button*/
            $(".buttons p").css("display", "inline-block");
            $(".buttons p").text(username);
            $(".buttons #btn_logout").css("display", "inline-block");
        }
    }
    /*call to execute*/
    checkUsername();

    /* Logout user */
    $("#btn_logout").click(function(e){
        e.preventDefault();
        $(".logout_background").css("display", "block")
    });
    $("#btn_yes_logout").click(function(){
        $(".logout_background").css("display", "none");
        /*delete form local storage*/
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        /*show login and sign up*/
        $(".buttons .btn_login").css("display", "inline-block");
        $(".buttons #btn_signup").css("display", "inline-block");
        
        /*hide username and logout button*/
        $(".buttons p").css("display", "none");
        $(".buttons #btn_logout").css("display", "none");
    });
    /*cancel logout*/
    $(".btn_cancel_logout").click(function(){
        $(".logout_background").css("display", "none");
    })

    /* Redirect to the Saved Music Page */
    $("#saved_music").click(function(){
        let username = localStorage.getItem("username");
        if(username === null){
            $(".login_background").css("display", "block");
        }
        else{
            getMusic();            
        }
    });
    let getMusic = () => {
        const userId = localStorage.getItem("user_id");
        $.ajax({
            url: "/music_library",
            type: "POST",
            data: { userId: userId},
            success: function(data){
                let musicList = JSON.stringify(data);
                localStorage.setItem('musicList', musicList);
                window.location.href = "/save_music_page";
            },
            error: function(xhr, status, error){
                console.error(error);
            }
        })   
    }
    
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