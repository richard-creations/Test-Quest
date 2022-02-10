var question = ""
chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'popup-modal') {
        question = request.term
        console.log(request.term)
        showModal();
        getData(encodeURIComponent(request.term)).then(data => {
            console.log(data)
            var res = document.getElementsByClassName("resu")[0];
            var obj = JSON.parse(JSON.stringify(data));
            const header = document.createElement("h3");
            header.innerHTML = `Results for "${question}"`;
            res.appendChild(header);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var items = obj[key];
                    for (var i = 0; i < items.length; i++) {
                        const card = document.createElement("div");
                        card.innerHTML = `
                          <div class="card horizontal">
                          <a href="${items[i].link}"  target="_blank" class="tq-link">
                          <div class="card-stacked">
                            <div class="card-content">
                              <span ><b>${items[i].title}</b></span>
                              <p>${items[i].preview} - <em><b>${items[i].site}</b></em> </p>
                            </div>
                          </div>
                          </a>
                        </div>
                          `;
                        res.appendChild(card);
                    }
                }
            }
            const load = document.getElementById("load")
            load.remove()
        })
    }
});


async function getData(text) {
    console.log("await " + text)
    try {
        const response = await fetch("http://127.0.0.1:5000/search/" + text);
        const resJson = await response.json();
        return resJson;
    } catch (error) {
        console.warn('getData error', error);
    }
    return null;
}

const showModal = () => {
    const modal = document.createElement("dialog");
    modal.setAttribute(
        "style", `
        height:600px;
        width:570px;
        border: none;
        top:150px;
        left:0px;
        border-radius:20px;
        background-color:white;
        position: fixed; 
        box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
        `
    );
    modal.innerHTML = `
        <style>
        /* Safari */
        @-webkit-keyframes spin {
          0% { -webkit-transform: rotate(0deg); }
          100% { -webkit-transform: rotate(360deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /*! CSS Used from: https://materializecss.com/css/ghpages-materialize.css ; media=screen, projection */
        @media screen, projection{
        a{background-color:transparent;-webkit-text-decoration-skip:objects;}
        img{border-style:none;}
        *,*:before,*:after{-webkit-box-sizing:inherit;box-sizing:inherit;}
        a{color:#039be5;text-decoration:none;-webkit-tap-highlight-color:transparent;}
        .card{-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2);box-shadow:0 2px 2px 0 rgba(0,0,0,0.14),0 3px 1px -2px rgba(0,0,0,0.12),0 1px 5px 0 rgba(0,0,0,0.2);}
        a{text-decoration:none;}
        .card{position:relative;margin:.5rem 0 1rem 0;background-color:#fff;-webkit-transition:-webkit-box-shadow .25s;transition:-webkit-box-shadow .25s;transition:box-shadow .25s;transition:box-shadow .25s, -webkit-box-shadow .25s;border-radius:2px;}
        .card.horizontal{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}
        .card.horizontal .card-image{max-width:50%;}
        .card.horizontal .card-image img{border-radius:2px 0 0 2px;max-width:100%;width:auto;}
        .card.horizontal .card-stcked{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;position:relative;}
        .card.horizontal .card-stacked .card-content{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;}
        .card .card-image{position:relative;}
        .card .card-image img{display:block;border-radius:2px 2px 0 0;position:relative;left:0;right:0;top:0;bottom:0;width:100%;}
        .card .card-content{padding:24px;border-radius:0 0 2px 2px;}
        .card .card-content p{margin:0;}
        .card .card-action{background-color:inherit;border-top:1px solid rgba(160,160,160,0.2);position:relative;padding:16px 24px;}
        .card .card-action:last-child{border-radius:0 0 2px 2px;}
        .card .card-action a:not(.btn):not(.btn-large):not(.btn-small):not(.btn-large):not(.btn-floating){color:#ffab40;margin-right:24px;-webkit-transition:color .3s ease;transition:color .3s ease;text-transform:uppercase;}
        .card .card-action a:not(.btn):not(.btn-large):not(.btn-small):not(.btn-large):not(.btn-floating):hover{color:#ffd8a6;}
        .tq-link {
          display:block;
          color:black
         }
        ::-webkit-input-placeholder{color:#d1d1d1;}
        ::-moz-placeholder{color:#d1d1d1;}
        :-ms-input-placeholder{color:#d1d1d1;}
        ::placeholder{color:#d1d1d1;}
        p{padding:0;}
        .card-content p{-webkit-font-smoothing:antialiased;}
        </style>
        <button style="padding: 8px 12px; font-size: 16px; border: none; border-radius: 20px;">x</button>
        <br>
       
        <div style= "font-size: 12px; padding: 8px 12px" class = "resu container"></div>

        </div>`;

    document.body.appendChild(modal);
    const dialog = document.querySelector("dialog");
    dialog.showModal();

    //adds spinner before loading results
    const loader = document.createElement("div")
    loader.setAttribute("class", "loader")
    loader.setAttribute("id", "load")
    loader.setAttribute(
        "style", `
            border: 16px solid #f3f3f3;
            border-radius: 50%;
            border-top: 16px solid #3498db;
            margin: auto;
            width: 120px;
            height: 120px;
            -webkit-animation: spin 2s linear infinite; /* Safari */
            animation: spin 2s linear infinite;
          `
    )
    const resu = document.getElementsByClassName("resu")[0];
    resu.appendChild(loader)
    dialog.querySelector("button").addEventListener("click", () => {
        resu.innerHTML = ""
        dialog.close();
    });
}