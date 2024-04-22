$(document).ready(function(){
    // /*trigger the input type file once button is clicked*/
    // $("#browse_file").click(function(){
    //     $("input[type='file']").trigger('click');
    // });
    // /*display selected image*/
    // $("input[type='file']").change(function(event){
    //     /*remove the default children*/
    //     $("#file_upload").css('display', 'none');
    //     handleDisplayImage(event);
    // });
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
    /*navigation*/
    $("#dashboard").click(function(){
        /*set all children display to block*/
        $(".custom_main_dash").find('*').css('display', 'block');
        $(".custom_buttons").css('display', 'block');

        $(".custom_link_dashboard").css("background-color", "gray");
        $(".custom_link_music").css("background-color", "white");
    
        $(".musiclist").css("display", "none");
    });
    /*Select saved music*/
    $("#music_library").click(function(){
        /*set all children display to none*/
        $(".custom_main_dash").find('*').css('display', 'none');
        $(".custom_buttons").css('display', 'none');
        $(".volumes").css("display", "block");
        $(".custom_link_dashboard").css("background-color", "white");
        $(".custom_link_music").css("background-color", "gray");
        retrieveMusic();
    });
    /*add music id to the modal*/
    $(".custom_main_dash").on("click", ".deleteIcon", function(){
        let selectedMusic = $(this).closest('figure')[0];
        let musicId = $(selectedMusic).find("input[name='music_id']").val();
        $("input[name='modal_music_id']").val(musicId);
    });
    $("#deleteMusic").click(function(){
        let musicIdDel = $("input[name='modal_music_id']").val();
        let figureId = $(".custom_main_dash").find("input[name='music_id']");
        for(let i = 0; i < figureId.length; i++){
            let val = $(figureId[i]).val();
            if(musicIdDel == val){
                /*remove the displayed music without reloading the page*/
                $(figureId[i]).parent().parent()[0].remove();
            }
        }
        deleteMusic(musicIdDel);
    });
    /*Display the selected music*/
    $(".custom_main_dash").on("click", ".musiclist", function(){
        let displayImagePath = $(this).find("div > img").attr("src");
        let displayMidiPath = $(this).find("figcaption > input[name='midiPath']").val();
        $("#image_path").val(displayImagePath);
        $("#midi_path").val(displayMidiPath);

        getMidi(displayMidiPath);

        displayRetrievedImage(displayImagePath);

        $(".custom_buttons").css("display", "block");
        /*set all children display to none*/
        // $(".custom_main_dash").find('*').css('display', 'none');
        // $(".custom_buttons").css('display', 'none');

        $(".custom_link_dashboard").css("background-color", "gray");
        $(".custom_link_music").css("background-color", "white");
    
        $(".musiclist").css("display", "none");
    })
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

    /*Functions*/
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
    let displayRetrievedImage = (path) => {
        for(let i = 0; i < 1; i++){
            let figure = document.createElement('figure');
            figure.style.width = '70%';
            figure.style.border = '1px solid black';
            figure.style.margin = '20px auto';

            let image = document.createElement('img');
            image.className = "uploaded_image"
            image.setAttribute('src', path);
            image.style.width = '100%';
            figure.appendChild(image);
            $(".custom_main_dash").append(figure);
        }
    }

    /*send image in flask server*/
    let convertToMidi = () => {
        $(".loader_background").css("display", "block");
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
                $("#volume").css("display", "block");
                getMidi(response.midiPath);
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

    let retrieveMusic = () => {
        
        $.ajax({
            url: "/music_library",
            type: "GET",
            dataType: "json",
            success: function(data){
                console.log(data);
                displayRetrievedMusic(data);
            },
            error: function(xhr, status, error){
                console.error(error);
            }
        })
    }

    let displayRetrievedMusic = (data) => {
        let musicNo = 1;
        for(let i = 0; i < data.length; i++){
            let figure = document.createElement('figure');
            figure.className = 'musiclist'
            figure.style.width = "25%";
            figure.style.height = "200px";
            figure.style.margin = "20px";
            figure.style.border = "1px solid black";
            figure.style.position = "relative";

            let icon = document.createElement('img');
            icon.className = "deleteIcon";
            icon.setAttribute("src", "/images/delete.svg");
            icon.style.position = "absolute";
            icon.style.top = "0px";
            icon.style.right = "0px";
            icon.setAttribute("data-toggle", "modal"); 
            icon.setAttribute("data-target", "#deleteModal");

            let div = document.createElement('div');
            div.style.height = "150px";
            div.style.overflow = "hidden";
            let img = document.createElement('img');
            div.append(img);

            img.style.width = "100%"
            img.setAttribute('src', data[i].image_path);

            let caption = document.createElement('figcaption');
            caption.innerText = "Music No." + musicNo;

            const date = new Date(data[i].created_at);
            const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            
            let span = document.createElement('span');
            span.innerText = formattedDate;
            span.style.display = "block";
            caption.append(span);

            let musicId = document.createElement('input');
            musicId.name = "music_id";
            musicId.type = "hidden";
            musicId.value = data[i].id;
            caption.append(musicId);

            let midi = document.createElement('input');
            midi.name = "midiPath";
            midi.type = "hidden";
            midi.value = data[i].midi_path;
            caption.append(midi);

            figure.append(icon);
            figure.append(div);
            figure.append(caption);
            $(".custom_main_dash").append(figure);
            musicNo++;
        }
    }
    
    let deleteMusic = (musicId) => {
        console.log(musicId);
        $.ajax({
            url: "/delete_music/"+musicId,
            type: "POST",
            success: function(response){
                console.log(response)
            },
            error: function(xhr, status, error){
                console.error(error);
            }
        })
    }
});