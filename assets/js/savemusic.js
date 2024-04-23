$(document).ready(function(){

    /*check if user is logged in or not*/    
    let checkUsername = () => {
        let username = localStorage.getItem("username");
        if(username !== null){
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
        
        window.location.href = "/";     
    });
    /*cancel logout*/
    $(".btn_cancel_logout").click(function(){
        $(".logout_background").css("display", "none");
    })
    
    let formatDate = (val) => {
        const date = new Date(val);

        // Get month, date, and year components
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();

        // Construct the "month date year" format
        return `${month} ${day}, ${year}`;
    }
    /* display saved music*/
    let displayMusic = () => {
        let musicList = JSON.parse(localStorage.getItem("musicList"));
        let num = 1;
        for(let i = 0; i < musicList.length; i++){
            let figure = document.createElement("figure");
            figure.setAttribute("id", musicList[i].id);
            let div = document.createElement("div");
            let img = document.createElement("img");
            img.className = "musicsheet"
            img.setAttribute("src", musicList[i].image_path);
            div.append(img);

            let figcaption =  document.createElement("figcaption");
            let title = document.createElement("span");
            title.textContent = "Music No. " + num;
            figcaption.append(title);

            let dateLabel = document.createElement('span');
            dateLabel.className = "span_date"
            let created_at = musicList[i].created_at;
            let date = formatDate(created_at);
            dateLabel.textContent = date;
            figcaption.append(dateLabel);

            let playIcon = document.createElement("img");
            playIcon.className = "btnPlay";
            playIcon.setAttribute("src", "/images/play_circle.svg");
            figure.append(playIcon);

            let icon = document.createElement('img');
            icon.className = "deleteIcon";
            icon.setAttribute("src", "/images/delete.svg");
            
            /*set the identification for each music*/
            let musicId = document.createElement("input");
            musicId.type = "hidden";
            musicId.name = "music_id"
            musicId.value = musicList[i].id;

            let imagePath = document.createElement("input");
            imagePath.type = "hidden";
            imagePath.name = "image_path";
            imagePath.value = musicList[i].image_path;

            let midiPath = document.createElement("input");
            midiPath.type = "hidden";
            midiPath.name = "midi_path";
            midiPath.value = musicList[i].midi_path;

            let musicNo = document.createElement("input");
            musicNo.type = "hidden";
            musicNo.name = "music_no";
            musicNo.value = num;

            figure.append(icon);
            figure.append(div);
            figure.append(figcaption);
            figure.append(musicId);
            figure.append(imagePath);
            figure.append(midiPath);
            figure.append(musicNo);
            $("main").append(figure);
            num++;
        }
    }
    displayMusic();

    /* change delete icon color when hover*/
    $(".deleteIcon").hover(
        function() {
            /*mouse hover*/
            $(this).attr("src", "/images/delete_orange.svg");
        },
        function() {
            /*mouse leave*/
            $(this).attr("src", "/images/delete.svg");
        }
    );
    $(".btnPlay").hover(
        function() {
            /* Mouse hover */
            $(this).attr("src", "/images/play_circle_dark.svg");
        },
        function() {
            /* Mouse leave */
            $(this).attr("src", "/images/play_circle.svg");
        }
    );

    /* open music in the playground */
    $(".btnPlay").click(function(e){
        e.preventDefault();
        let thisFigure = $(this).parent()
        const musicId = $(thisFigure[0]).find("input[name='music_id']").val();
        const imagePath = $(thisFigure[0]).find("input[name='image_path']").val();
        const midiPath = $(thisFigure[0]).find("input[name='midi_path']").val();
        const musicNo = $(thisFigure[0]).find("input[name='music_no']").val();
        
        $(".open_music_modal").find("figure").remove();
        $(".open_music_background").css("display", "block");
        
        let figure = document.createElement("figure");
        let div = document.createElement("div");
        let img = document.createElement('img');
        img.setAttribute("src", imagePath);
        div.append(img)

        let figcaption = document.createElement("figcaption");
        let title = document.createElement("span");
        title.textContent = "Music No." + musicNo;
        figcaption.append(title);
        
        let pathImage = document.createElement("input");
        pathImage.type = "hidden";
        pathImage.value = imagePath;
        pathImage.name = "image_path";

        let pathMidi = document.createElement("input");
        pathMidi.type = "hidden";
        pathMidi.value = midiPath;
        pathMidi.name = "midi_path";

        figure.append(div);
        figure.append(figcaption);
        figure.append(pathImage);
        figure.appendChild(pathMidi);

        $(".open_music_modal").find("p").after(figure);
    });
    $("#btn_open_music").click(function(){
        let modal = $(this).parent();
        const imagePath = $(modal[0]).find("input[name='image_path']").val();
        const midiPath = $(modal[0]).find("input[name='midi_path']").val();
        localStorage.setItem("image", imagePath);
        localStorage.setItem("midiPath", midiPath);

        window.location.href = "/playground";
    })
    $(".btn_cancel_open").click(function(){
        $(".open_music_background").css("display", "none");
    });
    /*delete music*/
    $(".deleteIcon").click(function(e){
        e.preventDefault(); 

        let thisDelete = $(this).parent();

        const musicId = $(thisDelete[0]).find("input[name='music_id']").val();
        const imagePath = $(thisDelete[0]).find("input[name='image_path']").val();
        const midiPath = $(thisDelete[0]).find("input[name='midi_path']").val();
        const musicNo = $(thisDelete[0]).find("input[name='music_no']").val();
        
        $(".delete_modal").find("figure").remove();
        $(".delete_background").css("display", "block");
        
        let figure = document.createElement("figure");
        let div = document.createElement("div");
        let img = document.createElement('img');
        img.setAttribute("src", imagePath);
        div.append(img)

        let figcaption = document.createElement("figcaption");
        let title = document.createElement("span");
        title.textContent = "Music No." + musicNo;
        figcaption.append(title);
        
        let pathImage = document.createElement("input");
        pathImage.type = "hidden";
        pathImage.value = imagePath;
        pathImage.name = "image_path";

        let pathMidi = document.createElement("input");
        pathMidi.type = "hidden";
        pathMidi.value = midiPath;
        pathMidi.name = "midi_path";

        let idMusic = document.createElement("input");
        idMusic.type = "hidden";
        idMusic.value = musicId;
        idMusic.name = "music_id";

        figure.append(div);
        figure.append(figcaption);
        figure.append(pathImage);
        figure.append(pathMidi);
        figure.append(idMusic);

        $(".delete_modal").find("p").after(figure);
    });
    /*delete music by id*/
    $("#btn_delete_music").click(function(){
        const modal = $(this).parent();
        const musicId = $(modal[0]).find("input[name='music_id']").val();
        /*update the localstorage, musicList will be updated*/
        let musicList = JSON.parse(localStorage.getItem("musicList"));
        let filteredMusic = [];
        for(let i = 0; i < musicList.length; i++){
            if(musicId != musicList[i].id){
                filteredMusic.push(musicList[i]);
            }
        }
        /*delete music in the localstorage and database*/
        localStorage.setItem("musicList", JSON.stringify(filteredMusic));
        deleteMusic(musicId);

        /*delete the selected music in the client side*/
        let allFigure = document.querySelectorAll("figure");
        allFigure.forEach(figure => {
            if(figure.id == musicId){
                $(figure).remove();
            }
        });
        $(".delete_background").css("display", "none");
    })
    $(".btn_cancel_delete").click(function(){
        $(".delete_background").css("display", "none");
    });
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