<?php

class AdminUploadController extends Controller {
    private const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    public function __construct() {
        parent::__construct();
        Auth::requireAdmin();
    }

    public function store(): void {
        // QEditor는 'image' 필드명, 기존 방식은 'file' 필드명 지원
        $fileKey = isset($_FILES['image']) ? 'image' : 'file';
        if (empty($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
            $this->json(['error' => '파일 업로드 오류'], 400);
        }

        $file = $_FILES[$fileKey];
        $mime = mime_content_type($file['tmp_name']);

        if (!in_array($mime, self::ALLOWED_MIME, true)) {
            $this->json(['error' => '허용되지 않는 파일 형식입니다.'], 400);
        }

        $maxBytes = UPLOAD_MAX_MB * 1024 * 1024;
        if ($file['size'] > $maxBytes) {
            $this->json(['error' => UPLOAD_MAX_MB . 'MB 이하 파일만 업로드 가능합니다.'], 400);
        }

        $ext      = match($mime) {
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/gif'  => 'gif',
            'image/webp' => 'webp',
        };
        $filename = uniqid('img_', true) . '.' . $ext;
        $destPath = UPLOAD_DIR . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            $this->json(['error' => '파일 저장 실패'], 500);
        }

        $this->json(['url' => UPLOAD_URL . $filename]);
    }
}
