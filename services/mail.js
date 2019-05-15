exports.mailTemplate = function (message) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet">
        <link rel="stylesheet" href="https://bootswatch.com/4/flatly/bootstrap.min.css">
    
        <style>
        .col {
            padding: 15px;
            background-color: #2C3E50;
        }

        .rd {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            color: white;
        }

        .logo {
            width: 60px;
            height: 52.13px;
            margin-right: 15px;
        }

        .content {
            padding: 15px;
        }
        </style>
    </head>
    
    <body>
    
        <div class="container">
            <div class="row">
                <div class="col" style="display:flex; align-items: center;">
                    <img class="logo" src="cid:logo" alt="logo" class="img-thumbnail">
                    <h2 class="rd">RedDinámica</h2>    
                </div>
            </div>
            <div class="content">                
                ${message}                
            </div>
        </div>
    
    </body>
    
    </html>

    `;
}

