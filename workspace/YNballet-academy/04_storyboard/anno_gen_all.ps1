# anno_gen_all.ps1 — 어노테이션 일괄 추출 (v2.0)

param([string]$section = "all", [switch]$fullRebuild = $false)
$ErrorActionPreference = "Continue"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$pagesJson = Join-Path $scriptDir "data\pages.json"
$specsDir = Join-Path $scriptDir "data\specs"
$outputsDir = Join-Path $scriptDir "..\outputs"
$annoScript = Join-Path $scriptDir "anno_gen.ps1"
$logFile = Join-Path $scriptDir "anno_run.log"
$stateFile = Join-Path $scriptDir "data\.anno_state.json"
$bsFile = Join-Path $scriptDir "data\.build_state.json"

function Save-BuildState($f,$d){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};New-Item $l -ItemType File -Force|Out-Null;try{$d|ConvertTo-Json -Depth 10|Set-Content $f -Encoding UTF8}finally{Remove-Item $l -Force -ErrorAction SilentlyContinue}}
function Load-BuildState($f){$l="$f.lock";$w=0;while((Test-Path $l)-and $w -lt 10){Start-Sleep -Milliseconds 500;$w+=0.5};if(Test-Path $f){try{return(Get-Content $f -Encoding UTF8|Out-String|ConvertFrom-Json -AsHashtable)}catch{return @{pages=@{}}}};return @{pages=@{}}}

if(-not(Test-Path $pagesJson)){Write-Host "FAIL: pages.json 없음";exit 1}
if(-not(Test-Path $specsDir)){New-Item -ItemType Directory -Path $specsDir|Out-Null}

$state=@{};if((Test-Path $stateFile)-and -not $fullRebuild){$state=Get-Content $stateFile -Encoding UTF8|Out-String|ConvertFrom-Json -AsHashtable}
$bs=Load-BuildState $bsFile
"anno_gen_all.ps1: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"|Set-Content $logFile -Encoding UTF8
function Log($msg){Add-Content -Path $logFile -Value $msg -Encoding UTF8}

$allPages=Get-Content $pagesJson -Encoding UTF8|Out-String|ConvertFrom-Json
if($section -ne "all"){$allPages=$allPages|Where-Object{$_.section -eq $section}}
$targets=$allPages|Where-Object{$_.path -ne "#" -and $_.section -ne "doc"}
if(-not $fullRebuild){$targets=$targets|Where-Object{($_.tags -contains "changed")-or(-not $state.ContainsKey($_.id))}}

$okCount=0;$skipCount=0;$failCount=0;$blockedCount=0
if($targets.Count -eq 0){Write-Host "어노테이션 완료: 변경 없음";exit 0}

foreach($page in $targets){
  $id=$page.id
  if($bs.pages.ContainsKey($id)-and $bs.pages[$id].ContainsKey("capture")){if($bs.pages[$id]["capture"] -ne "OK"){Log "[$id] BLOCKED";$blockedCount++;if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["anno"]="BLOCKED";continue}}
  $specId=$id -replace "-","";$specFile=Join-Path $specsDir "$specId.js";$htmlPath=Join-Path $outputsDir $page.path.TrimStart("../")
  if(-not(Test-Path $specFile)){Log "[$id] SKIP spec없음";$skipCount++;continue}
  if(-not(Test-Path $htmlPath)){Log "[$id] SKIP HTML없음";$skipCount++;continue}
  $html=Get-Content $htmlPath -Encoding UTF8 -Raw;if($html -notmatch "data-sb-anno"){Log "[$id] SKIP anno없음";$skipCount++;continue}
  try{
    if(Test-Path $annoScript){& powershell -ExecutionPolicy Bypass -File $annoScript -pageId $id -path $page.path 2>&1|Out-Null}
    if($LASTEXITCODE -eq 0){Log "[$id] OK";$okCount++;$state[$id]=(Get-Date -Format "yyyy-MM-dd HH:mm");if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["anno"]="OK"}
    else{Log "[$id] FAIL";$failCount++;if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["anno"]="FAIL"}
  }catch{Log "[$id] FAIL: $_";$failCount++;if(-not $bs.pages.ContainsKey($id)){$bs.pages[$id]=@{}};$bs.pages[$id]["anno"]="FAIL"}
}
$state|ConvertTo-Json|Set-Content $stateFile -Encoding UTF8
Save-BuildState $bsFile $bs
Write-Host "어노테이션 완료: OK=$okCount SKIP=$skipCount FAIL=$failCount BLOCKED=$blockedCount"
