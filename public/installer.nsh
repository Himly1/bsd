!macro preInit
 SetRegView 64
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Windows\BSD"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Windows\BSD"
 SetRegView 32
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Windows\BSD"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Windows\BSD"
!macroend

!macro customInstall
  ExecWait '$INSTDIR\resources\pythonScripts\win32\python-3.11.0.exe /repair /quiet InstallAllUsers=1 PrependPath=1'
!macroend

!macro customUnInstall
  ExecWait "schtasks /Delete /TN BSD-TASK -F"
  ExecWait "del /f C:\Windows\BSD"
!macroend