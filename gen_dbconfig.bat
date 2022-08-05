@echo off

@REM Go from proj\bin\ to proj\
cd ..

@REM Exit if the DB config file is already in place
if exist Database.config (
    echo Database config already in place
    exit
)

@REM Create the DB config file template. Umbraco will add the connection string during install
echo ^<^?xml version^=^"1.0^" encoding^=^"utf-8^"^?^>^<connectionStrings^>^<remove name^=^"umbracoDbDSN^" /^>^</connectionStrings^> > Database.config
echo Created empty database config file
