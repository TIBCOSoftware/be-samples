@ECHO OFF
::
:: Copyright (c) 2016-$Date: 2017-06-08 12:49:17 -0700 (Thu, 08 Jun 2017) $ Cloud Software Group, Inc.
:: All Rights Reserved. Confidential & Proprietary.
:: For more information, please contact:
:: TIBCO Software Inc., Palo Alto, California, USA

:: set ActiveSpaces Home and FTL HomePath
set TIBDG_ROOT=<ACTIVESPACES_HOME>
set TIBFTL_ROOT=<FTL_HOME>

:: set FTL jar/dll
set TIBFTL_JAVA=%TIBFTL_ROOT%\lib
set TIBFTL_DLL=%TIBFTL_ROOT%\bin

if NOT EXIST "%TIBFTL_JAVA%\tibftl.jar" goto badftl
if NOT EXIST "%TIBFTL_JAVA%\tibftlgroup.jar" goto badftl

set CLASSPATH=.;%TIBFTL_JAVA%\tibftl.jar;%TIBFTL_JAVA%\tibftlgroup.jar;%CLASSPATH%
set PATH=%TIBFTL_DLL%;%PATH%

:: set TIBDG jar/dll
set TIBDG_JAVA=%TIBDG_ROOT%\lib
set TIBDG_DLL=%TIBDG_ROOT%\bin

if NOT EXIST "%TIBDG_JAVA%\tibdg.jar" goto badtibdg
if NOT EXIST "%TIBFTL_ROOT%\bin\tibftlserver.exe" goto badtibdg

set CLASSPATH=.;%TIBDG_JAVA%\tibdg.jar;%CLASSPATH%
set PATH=%TIBDG_DLL%;%PATH%
goto end

:badftl
echo Error: The TIBFTL_ROOT variable does not correctly specify the root
echo directory of the TIBCO FTL software. Please ensure you set
echo appropriate FTL_HOME directory.
goto end

:badtibdg
echo Error: The TIBDG_ROOT variable does not not correctly specify the root
echo directory of the ActiveSpaces software. Please ensure you set
echo appropriate ACTIVESPACES_HOME directory.
goto end

:end