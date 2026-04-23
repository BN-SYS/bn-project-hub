# extract_anno_elements.ps1 — anno 요소 JSON 추출 (v2.0)

param([string]$section = "all")
$ErrorActionPreference = "Continue"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pagesJson = Join-Path $scriptDir "data\pages.json"
$outputsDir = Join-Path $scriptDir "..\outputs"
$logFile = Join-Path $scriptDir "extract_run.log"
$bsFile = Join-Path $scriptDir "data\.build_state.json"

function Save-BuildState($f,$d){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};New-Item $l -ItemType File -Force|Out-Null;try{$d|ConvertTo-Json -Depth 10|Set-Content $f -Encoding UTF8}finally{Remove-Item $l -Force -ErrorAction SilentlyContinue}}
function Load-BuildState($f){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};if(Test-Path $f){try{return(Get-Content $f -Encoding UTF8|Out-String|ConvertFrom-Json -AsHashtable)}catch{return @{pages=@{}}}};return @{pages=@{}}}

if(-not(Test-Path $pagesJson)){Write-Host "FAIL: pages.json 없음";exit 1}
"extract: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"|Set-Content $logFile -Encoding UTF8
function Log($msg){Add-Content -Path $logFile -Value $msg -Encoding UTF8}
$bs=Load-BuildState $bsFile
$allPages=Get-Content $pagesJson -Encoding UTF8|Out-String|ConvertFrom-Json
if($section -ne "all"){$allPages=$allPages|Where-Object{$_.section -eq $section}}
$targets=$allPages|Where-Object{$_.path -ne "#" -and $_.section -ne "doc"}
$results=@()
foreach($page in $targets){
  if($bs.pages.ContainsKey($page.id)-and $bs.pages[$page.id].ContainsKey("publisher")){if($bs.pages[$page.id]["publisher"] -ne "OK"){Log "[$($page.id)] BLOCKED";if(-not $bs.pages.ContainsKey($page.id)){$bs.pages[$page.id]=@{}};$bs.pages[$page.id]["extract"]="BLOCKED";continue}}
  $htmlPath=Join-Path $outputsDir $page.path.TrimStart("../")
  if(-not(Test-Path $htmlPath)){Log "[$($page.id)] SKIP";continue}
  $html=Get-Content $htmlPath -Encoding UTF8 -Raw
  $tagMatches=[regex]::Matches($html,'<(\w+)([^>]*data-sb-anno="[^"]*"[^>]*)>')
  $annotations=@()
  foreach($tm in $tagMatches){
    $tagName=$tm.Groups[1].Value;$attrs=$tm.Groups[2].Value
    $anno=if($attrs -match 'data-sb-anno="([^"]*)"'){$Matches[1]}else{""}
    $class=if($attrs -match 'class="([^"]*)"'){$Matches[1]}else{""}
    if($anno -ne ""){$annotations+=[ordered]@{anno=$anno;tag=$tagName;class=$class}}
  }
  if($annotations.Count -eq 0){Log "[$($page.id)] SKIP anno없음";continue}
  $results+=[ordered]@{id=$page.id;name=$page.name;section=$page.section;group=$page.group;path=$page.path;annotations=$annotations}
  Log "[$($page.id)] OK ($($annotations.Count)개)"
  if(-not $bs.pages.ContainsKey($page.id)){$bs.pages[$page.id]=@{}};$bs.pages[$page.id]["extract"]="OK"
}
$suffix=if($section -eq "all"){"all"}else{$section}
$results|ConvertTo-Json -Depth 10|Set-Content (Join-Path $scriptDir "data\anno_elements_$suffix.json") -Encoding UTF8
Save-BuildState $bsFile $bs
Write-Host "anno 추출 완료: $($results.Count)개"
