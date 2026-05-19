' Nova Agency Video Worker — inicio silencioso (sin ventana)
' Copiá este archivo a:
'   C:\Users\facui\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\
' Y se ejecutará automáticamente cuando iniciés sesión en Windows.

Dim WshShell
Set WshShell = CreateObject("WScript.Shell")

' windowStyle=0 = sin ventana
WshShell.Run "cmd /c """ & "C:\Users\facui\Desktop\remotion-engine\start-worker.bat" & """", 0, False

Set WshShell = Nothing
