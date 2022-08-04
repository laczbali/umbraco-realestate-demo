Set-Location ..\

if (!(Test-Path ".\assets\lib\animate\")) { New-Item ".\assets\lib\animate\" -ItemType Directory }
Copy-Item -Path ".\node_modules\animate.css\animate.min.css" -Destination ".\assets\lib\animate\" -ea stop;

if (!(Test-Path ".\assets\lib\bootstrap\")) { New-Item ".\assets\lib\bootstrap\" -ItemType Directory }
Copy-Item -Path ".\node_modules\bootstrap\dist\css\bootstrap.min.css" -Destination ".\assets\lib\bootstrap\" -ea stop;
Copy-Item -Path ".\node_modules\bootstrap\dist\css\bootstrap.min.css.map" -Destination ".\assets\lib\bootstrap\" -ea stop;
Copy-Item -Path ".\node_modules\bootstrap\dist\js\bootstrap.min.js" -Destination ".\assets\lib\bootstrap\" -ea stop;
Copy-Item -Path ".\node_modules\bootstrap\dist\js\bootstrap.min.js.map" -Destination ".\assets\lib\bootstrap\" -ea stop;

if (!(Test-Path ".\assets\lib\font-awesome\")) { New-Item ".\assets\lib\font-awesome\" -ItemType Directory }
if (!(Test-Path ".\assets\lib\fonts\")) { New-Item ".\assets\lib\fonts\" -ItemType Directory }
Copy-Item -Path ".\node_modules\font-awesome\css\font-awesome.min.css" -Destination ".\assets\lib\font-awesome\" -ea stop;
Copy-Item -Path ".\node_modules\font-awesome\fonts\fontawesome-webfont.ttf" -Destination ".\assets\lib\fonts\" -ea stop;
Copy-Item -Path ".\node_modules\font-awesome\fonts\fontawesome-webfont.woff" -Destination ".\assets\lib\fonts\" -ea stop;
Copy-Item -Path ".\node_modules\font-awesome\fonts\fontawesome-webfont.woff2" -Destination ".\assets\lib\fonts\" -ea stop;

if (!(Test-Path ".\assets\lib\ionicons\")) { New-Item ".\assets\lib\ionicons\" -ItemType Directory }
if (!(Test-Path ".\assets\lib\fonts\")) { New-Item ".\assets\lib\fonts\" -ItemType Directory }
Copy-Item -Path ".\node_modules\ionicons\dist\css\ionicons.min.css" -Destination ".\assets\lib\ionicons\" -ea stop;
Copy-Item -Path ".\node_modules\ionicons\dist\fonts\ionicons.ttf" -Destination ".\assets\lib\fonts\" -ea stop;
Copy-Item -Path ".\node_modules\ionicons\dist\fonts\ionicons.woff" -Destination ".\assets\lib\fonts\" -ea stop;
Copy-Item -Path ".\node_modules\ionicons\dist\fonts\ionicons.woff2" -Destination ".\assets\lib\fonts\" -ea stop;

if (!(Test-Path ".\assets\lib\jquery\")) { New-Item ".\assets\lib\jquery\" -ItemType Directory }
Copy-Item -Path ".\node_modules\jquery\dist\jquery.min.js" -Destination ".\assets\lib\jquery\" -ea stop;

if (!(Test-Path ".\assets\lib\easing\")) { New-Item ".\assets\lib\easing\" -ItemType Directory }
Copy-Item -Path ".\node_modules\jquery.easing\jquery.easing.min.js" -Destination ".\assets\lib\easing\" -ea stop;

if (!(Test-Path ".\assets\lib\owlcarousel\")) { New-Item ".\assets\lib\owlcarousel\" -ItemType Directory }
Copy-Item -Path ".\node_modules\owl.carousel\dist\assets\owl.carousel.min.css" -Destination ".\assets\lib\owlcarousel\" -ea stop;
Copy-Item -Path ".\node_modules\owl.carousel\dist\owl.carousel.min.js" -Destination ".\assets\lib\owlcarousel\" -ea stop;

if (!(Test-Path ".\assets\lib\scrollreveal\")) { New-Item ".\assets\lib\scrollreveal\" -ItemType Directory }
Copy-Item -Path ".\node_modules\scrollreveal\dist\scrollreveal.min.js" -Destination ".\assets\lib\scrollreveal\" -ea stop;
