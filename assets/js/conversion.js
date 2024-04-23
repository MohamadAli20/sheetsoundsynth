$(document).ready(function(){
    /* For Login Modal */
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
    /*redireact to home*/
    let redirectHome = () => {
        window.location.href = "/playground";
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
    /*Save music to the localStorage and database*/
    $("#save_music").click(function(){
        $(".save_background").css("display", "block");
    })
    $("#btn_save_music").click(function(){
        const userId = localStorage.getItem("user_id");
        const imagePath = localStorage.getItem("imagePath");
        const midiPath = localStorage.getItem("midiPath");
        $.ajax({
            url: "/save_music",
            type: "POST",
            data: { id: userId, pathImage: imagePath, pathMidi: midiPath },
            success: function(response) {
                console.log("Success:", response);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }

        })
        $(".save_background").css("display", "none");
    });
    $(".btn_cancel_music").click(function(){
        $(".save_background").css("display", "none");
    });

    /* For Music*/
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