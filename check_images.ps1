Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem 'c:\Users\1\Desktop\BLOG\post-image' -File
$results = foreach ($f in $files) {
    try {
        $img = [System.Drawing.Image]::FromFile($f.FullName)
        $w = $img.Width
        $h = $img.Height
        $img.Dispose()
        $ratio = [math]::Round($w / [math]::Max($h,1), 2)
        $type = if ($h -gt $w) { 'PORTRAIT' } elseif ($w -gt $h) { 'LANDSCAPE' } else { 'SQUARE' }
        [PSCustomObject]@{
            Name = $f.Name
            Width = $w
            Height = $h
            Ratio = $ratio
            Type = $type
        }
    } catch {
        [PSCustomObject]@{ Name = $f.Name; Width = 'ERR'; Height = 'ERR'; Ratio = '-'; Type = '?' }
    }
}
$results | Format-Table -AutoSize
Write-Host "--- 汇总 ---" -ForegroundColor Cyan
$results | Group-Object Type | Select-Object Name, Count | Format-Table -AutoSize
