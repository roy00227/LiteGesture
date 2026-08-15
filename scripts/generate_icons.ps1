Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot "..\icons"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

function New-GestureIcon {
    param([int]$Size, [string]$OutPath)

    $bmp = [System.Drawing.Bitmap]::new($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Background: rounded square with a blue gradient
    $radius = $Size * 0.22
    $d = $radius * 2
    $bgPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $bgPath.AddArc(0.0, 0.0, $d, $d, 180.0, 90.0)
    $bgPath.AddArc([float]($Size - $d), 0.0, $d, $d, 270.0, 90.0)
    $bgPath.AddArc([float]($Size - $d), [float]($Size - $d), $d, $d, 0.0, 90.0)
    $bgPath.AddArc(0.0, [float]($Size - $d), $d, $d, 90.0, 90.0)
    $bgPath.CloseFigure()

    $colorLight = [System.Drawing.Color]::FromArgb(255, 122, 168, 224)
    $colorDark  = [System.Drawing.Color]::FromArgb(255, 22, 52, 92)
    $pt1 = [System.Drawing.PointF]::new(0.0, 0.0)
    $pt2 = [System.Drawing.PointF]::new([float]$Size, [float]$Size)
    $brush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pt1, $pt2, $colorLight, $colorDark)
    $g.FillPath($brush, $bgPath)

    # Foreground: bold L-shaped arrow representing a down-then-right gesture
    $penWidth = $Size * 0.16
    $pen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, $penWidth)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $startX = $Size * 0.32
    $startY = $Size * 0.22
    $cornerY = $Size * 0.66
    $endX = $Size * 0.66

    $trail = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $trail.AddLine([float]$startX, [float]$startY, [float]$startX, [float]$cornerY)
    $trail.AddLine([float]$startX, [float]$cornerY, [float]$endX, [float]$cornerY)
    $g.DrawPath($pen, $trail)

    # Arrowhead triangle at the end of the line
    $arrowLen = $Size * 0.26
    $arrowW = $Size * 0.20
    $solidBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $arrowPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $p1 = [System.Drawing.PointF]::new([float]($endX + $arrowLen), [float]$cornerY)
    $p2 = [System.Drawing.PointF]::new([float]$endX, [float]($cornerY - $arrowW))
    $p3 = [System.Drawing.PointF]::new([float]$endX, [float]($cornerY + $arrowW))
    $arrowPath.AddPolygon([System.Drawing.PointF[]]@($p1, $p2, $p3))
    $g.FillPath($solidBrush, $arrowPath)

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    $pen.Dispose()
    $brush.Dispose()
    $solidBrush.Dispose()
}

New-GestureIcon -Size 128 -OutPath (Join-Path $outDir "icon128.png")
New-GestureIcon -Size 48  -OutPath (Join-Path $outDir "icon48.png")
New-GestureIcon -Size 16  -OutPath (Join-Path $outDir "icon16.png")

Write-Output "Icons generated in $outDir"
