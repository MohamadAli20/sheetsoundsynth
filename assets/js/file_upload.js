$(document).ready(function(){
    /*trigger the input type file once button is clicked*/
    $("#browse_file").click(function(){
        $("input[type='file'").trigger('click');
    });
    /*display selected image*/
    $("input[type='file'").change(function(event){
        /*remove the default children*/
        $("#file_upload").css('display', 'none');
        handleDisplayImage(event);        
        
        $(".buttons").css("display", "flex");
    });
    /*change selected image*/
    $("#add_more").click(function(){
        $("input[type='file'").trigger('click');
    });
    /*clear selected images*/
    $("#clear").click(function(){
        $(".main_div > figure").remove();
        $("#file_upload").css('display', 'block');
    });

    let handleDisplayImage = (event) => {
        let files = event.target.files;

        for(let i = 0; i <= files.length; i++){
            let figure = document.createElement('figure');
            figure.style.width = '70%';
            figure.style.border = '1px solid black';
            figure.style.margin = '20px auto';

            let image = document.createElement('img');
            image.setAttribute('src', URL.createObjectURL(event.target.files[i]));
            image.style.width = '100%';
            figure.appendChild(image);
            $(".main_div").append(figure);
        }
    }
});