@echo off

@REM Database connection string should not be uploaded to git
@REM By default it is stored in Web.config, which SHOULD be uploaded to git
@REM Therefore Web.config was set up, so it pulls the connection string from Database.config instead
@REM However Umbraco fails to start if that file does not exists (like after a fresh clone)
@REM This script generats that file, as a "blank"
@REM During the Umbraco first-start-install process, Umbraco will add the connection string to the file

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
