; Custom NSIS hooks for the GenSource Template installer.
; Referenced via bundle.windows.nsis.installerHooks in tauri.windows.conf.json.
; See: https://v2.tauri.app/distribute/windows-installer/#hooks

!macro NSIS_HOOK_PREINSTALL
  ; Runs before files are copied and registry keys are written.
!macroend

!macro NSIS_HOOK_POSTINSTALL
  ; Runs after files, registry keys, and shortcuts have been created.
!macroend

!macro NSIS_HOOK_PREUNINSTALL
  ; Runs before any files, registry keys, or shortcuts are removed.
!macroend

!macro NSIS_HOOK_POSTUNINSTALL
  ; Runs after files, registry keys, and shortcuts have been removed.
!macroend
