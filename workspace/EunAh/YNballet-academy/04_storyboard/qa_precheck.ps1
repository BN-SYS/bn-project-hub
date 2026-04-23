# qa_precheck.ps1 — 파일·좌표·n연속성 검증 (v2.0)
# ※ pipeline.ps1에서는 호출하지 않음. storyboard-agent가 스펙 생성 후 별도 Bash 실행.

$ErrorActionPreference = "Continue"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pagesJson = Join-Path $scriptDir "data\pages.json"
$specsDir = Join-Path $scriptDir "data\specs"
$imagesDir = Join-Path $scriptDir "images"
$outputsDir = Join-Path $scriptDir "..\outputs"
$resultFile = Join-Path $scriptDir "data\qa_precheck_result.json"
$bsFile = Join-Path $scriptDir "data\.build_state.json"

function Save-BuildState($f,$d){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};New-Item $l -ItemType File -Force|Out-Null;try{$d|ConvertTo-Json -Depth 10|Set-Content $f -Encoding UTF8}finally{Remove-Item $l -Force -ErrorAction SilentlyContinue}}
function Load-BuildState($f){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};if(Test-Path $f){try{return(Get-Content $f -Encoding UTF8|Out-String|ConvertFrom-Json -AsHashtable)}catch{return @{pages=@{}}}};return @{pages=@{}}}

if(-not(Test-Path $pagesJson)){Write-Host "FAIL: pages.json 없음";exit 1}
$bs=Load-BuildState $bsFile
$pages=Get-Content $pagesJson -Encoding UTF8|Out-String|ConvertFrom-Json
$targets=$pages|Where-Object{$_.path -ne "#" -and $_.section -ne "doc"}
$results=@();$okCount=0;$failCount=0;$blockedCount=0

foreach($page in $targets){
  $id=$page.id;$specId=$id -replace "-","";$issues=@()
  $imgPath=Join-Path $imagesDir $page.img;if(-not(Test-Path $imgPath)){$issues+="PNG없음"}
  $specFile=Join-Path $specsDir "$specId.js";if(-not(Test-Path $specFile)){$issues+="spec없음"}
  $htmlPath=Join-Path $outputsDir $page.path.TrimStart("../");if($page.path -ne "#" -and -not(Test-Path $htmlPath)){$issues+="HTML없음"}
  if(Test-Path $specFile){
    $sc=Get-Content $specFile -Encoding UTF8 -Raw
    $cm=[regex]::Matches($sc,'"x"\s*:\s*([\d.]+)|"y"\s*:\s*([\d.]+)|x\s*:\s*([\d.]+)|y\s*:\s*([\d.]+)')
    foreach($m in $cm){$raw=($m.Groups[1].Value,$m.Groups[2].Value,$m.Groups[3].Value,$m.Groups[4].Value)|Where-Object{$_ -ne ""}|Select-Object -First 1;if($raw){$val=[double]$raw;if($val -lt 0 -or $val -gt 100){$issues+="좌표범위초과(${val}%)";break}}}
    $nm=[regex]::Matches($sc,'"n"\s*:\s*(\d+)|n\s*:\s*(\d+)');$nv=$nm|ForEach-Object{$v=($_.Groups[1].Value,$_.Groups[2].Value)|Where-Object{$_ -ne ""}|Select-Object -First 1;[int]$v}|Sort-Object -Unique
    if($nv.Count -gt 0){$exp=1..$nv[-1];$miss=$exp|Where-Object{$nv -notcontains $_};if($miss.Count -gt 0){$issues+="n번호누락($($miss -join ','))"}}
  }
  $status=if($issues.Count -eq 0){"OK";$okCount++}else{"FAIL";$failCount++}
  if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["qa"]=$status
  $results+=[ordered]@{id=$id;name=$page.name;status=$status;issues=$issues}
}

# build_state step을 "done"으로 갱신 (qa_precheck가 최종 단계)
$bs | Add-Member -NotePropertyName "step" -NotePropertyValue $(if ($failCount -eq 0) {"done"} else {"partial"}) -Force
$bs | Add-Member -NotePropertyName "failCount" -NotePropertyValue $failCount -Force
$bs | Add-Member -NotePropertyName "completedAt" -NotePropertyValue (Get-Date -Format "yyyy-MM-dd HH:mm") -Force

[ordered]@{executedAt=(Get-Date -Format "yyyy-MM-dd HH:mm");total=$targets.Count;ok=$okCount;fail=$failCount;blocked=$blockedCount;items=$results}|ConvertTo-Json -Depth 10|Set-Content $resultFile -Encoding UTF8
Save-BuildState $bsFile $bs
Write-Host "precheck 완료: OK=$okCount FAIL=$failCount BLOCKED=$blockedCount"
