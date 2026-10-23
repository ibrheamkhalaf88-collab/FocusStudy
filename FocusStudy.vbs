Set WshShell = CreateObject("WScript.Shell")
Set Fso = CreateObject("Scripting.FileSystemObject")
base = Fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = base
WshShell.Run Chr(34) & base & "\node_modules\electron\dist\electron.exe" & Chr(34) & " .", 0, False
