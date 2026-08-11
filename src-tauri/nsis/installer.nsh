; Custom NSIS hooks for the GenSource Template installer.
; Referenced via bundle.windows.nsis.installerHooks in tauri.windows.conf.json.
; See: https://v2.tauri.app/distribute/windows-installer/#hooks

!macro NSIS_HOOK_PREINSTALL
  ; Runs before files are copied and registry keys are written.
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; Runs after files, registry keys, and shortcuts have been created.
  ; appinfo.json is visible under other/configs but not meant for user edits.
  IfFileExists "$INSTDIR\other\configs\appinfo.json" 0 skip_appinfo_readonly
    SetFileAttributes "$INSTDIR\other\configs\appinfo.json" READONLY
  skip_appinfo_readonly:
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  ; Runs before any files, registry keys, or shortcuts are removed.
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  ; Runs after files, registry keys, and shortcuts have been removed.
!macroend
