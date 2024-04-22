$(document).ready(function(){

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

    /*function*/
    let redirectHome = () => {
        window.location.href = "/";
    }
});
    